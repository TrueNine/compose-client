import {type Late, type SafeAny, STR_EMPTY, STR_SLASH} from '@compose/compose-types'
import {type NavigationGuardNext, type RouteLocationNormalized, type RouteMeta, type RouteRecordRaw, type RouteRecordRedirectOption} from 'vue-router'

import {camelTo} from '../tools' // 定义路由处理选项的接口

// 定义路由处理选项的接口
export interface HandleRouteOption {
  metaUrl: string
  url: string
  paths: string[]
  name: string
  fileName: string
  isFn: boolean
  isView: boolean
  isSubPage: boolean
  isFolderSubPage: boolean
  source: ImportMeta
  cfg?: HandleRouteOption
  parentUrl?: string
  fullUrl: string
}

export type HandledRouteOptions = Record<string, HandleRouteOption>

export const PAGE = 'pages'
export const SUB_PAGE = 'SubPage'
export const NAME_LINK = '___'
export const VIEW_PAGE = 'View'

export function resolveImport(tp: [string, ImportMeta]): HandleRouteOption {
  const metaUrl = tp[0]
  const source = tp[1]
  const paths = metaUrl.split(PAGE).filter(Boolean).slice(1).join('').split('/').filter(Boolean)
  const fileName = paths.pop()!
  if (paths.length === 0) paths.push(STR_SLASH)
  if (paths[0] !== STR_SLASH) paths.unshift(STR_SLASH)
  const isFn = typeof source === 'function'
  const isView = fileName.includes(VIEW_PAGE)
  const isFolderSubPage = paths.length > 1
  const isSubPage = fileName.includes(SUB_PAGE)
  const url = paths.join(STR_SLASH).replace(`${STR_SLASH}${STR_SLASH}`, STR_SLASH)
  const name = url.slice(1).replace(new RegExp(STR_SLASH, 'g'), '-') || '-'
  const result: HandleRouteOption = {
    url,
    isView,
    isSubPage,
    isFolderSubPage,
    metaUrl,
    source,
    isFn,
    paths,
    fileName,
    name,
    fullUrl: url
  }
  if (isFolderSubPage && !(isSubPage || isView)) {
    result.url = paths[paths.length - 1]
    result.parentUrl = paths.slice(0, -1).join(STR_SLASH).replace(`${STR_SLASH}${STR_SLASH}`, STR_SLASH)
  }
  if (isSubPage) {
    result.url = camelTo(fileName.split(SUB_PAGE)[0], STR_SLASH)
    result.name = result.name + '-' + camelTo(fileName.split(SUB_PAGE)[0], STR_SLASH)
  }
  if (isView) {
    result.url = camelTo(fileName.split(VIEW_PAGE)[0], STR_SLASH)
    result.name = result.name + '-' + camelTo(fileName.split(VIEW_PAGE)[0], STR_SLASH)
  }
  if (isSubPage || isView) {
    result.parentUrl = url
    result.paths.push(result.url)
    result.fullUrl = `${result.parentUrl}${STR_SLASH}${result.url}`
  }
  return result
}

export type CustomRouteRecordRaw = RouteRecordRaw & {
  fullPath: string
}

function resolvePageConfigToConfig(importMeta?: HandleRouteOption) {
  if (importMeta) {
    const cfg = importMeta.source as unknown as Late<PageConfig>
    if (cfg) return cfg
  }
  return undefined
}

export function resolveSubPath(pathRouteOption: HandledRouteOptions): CustomRouteRecordRaw[] {
  const all: HandleRouteOption[] = []
  const view: HandleRouteOption[] = []

  for (const key in pathRouteOption) {
    const option = pathRouteOption[key]
    if (option.isView) view.push(option)
    else all.push(option)
  }

  const allRoutes: Late<CustomRouteRecordRaw>[] = all.map(e => {
    const cfg = resolvePageConfigToConfig(e.cfg)
    return {
      path: e.url,
      redirect: cfg?.redirect,
      name: e.name,
      components: {
        default: e.source
      },
      children: [],
      meta: cfg?.meta ?? {},
      fullPath: e.fullUrl
    } as CustomRouteRecordRaw
  })

  const result: CustomRouteRecordRaw[] = []
  for (let i = 0; i < allRoutes.length; i++) {
    const e = allRoutes[i]
    if (!e) continue
    const opt = all.find(r => r.name === e?.name)!
    if (opt.isSubPage || opt.isFolderSubPage) {
      const parent = allRoutes.find(r => r?.fullPath === opt?.parentUrl)
      if (parent) parent.children?.push(e)
    } else result.push(e)
  }

  function cleanFirstSlash(path: string): string {
    if (path === STR_SLASH) return STR_SLASH
    return path[0] === STR_SLASH ? path.substring(1) : path
  }

  function deepFind(
    routes: RouteRecordRaw[],
    paths: Late<string[]> = undefined,
    startLength = 0,
    last: Late<RouteRecordRaw> = undefined
  ): Late<RouteRecordRaw> {
    if (!paths || paths.length === 0) return undefined
    if (routes.length === 0 && startLength === 0) return undefined
    if (paths.length === startLength) return last
    const currentPath = paths[startLength]
    for (let i = 0; i < routes.length; i++) {
      if (cleanFirstSlash(currentPath) === cleanFirstSlash(routes[i].path)) {
        return deepFind(routes[i].children!, paths, startLength + 1, routes[i])
      }
    }
    return undefined
  }

  view.forEach(e => {
    const root = deepFind(result, e.paths.slice(0, -1))
    if (root && root.children !== undefined) {
      const child = root.children
      const initPath = child.find(e => e.path === STR_EMPTY)
      if (initPath) initPath.components![e.name] = e.source
      else child.push({path: STR_EMPTY, name: root.name, components: {[e.name]: e.source}})
    }
  })

  return result
}

export function resolveRouters(): RouteRecordRaw[] {
  const cfgSources = import.meta.glob([`/**/pages/**/**.page.ts`, `/**/pages/**/**.page.js`], {eager: true, import: 'default'})
  const vueSources = import.meta.glob([`/**/pages/**/**.vue`, `/**/pages/**/**.jsx`, `/**/pages/**/**.tsx`])

  const cfg: HandledRouteOptions = {}
  for (const key in cfgSources) {
    const source = cfgSources[key]
    const option = resolveImport([key, source as unknown as ImportMeta])
    cfg[option.fullUrl] = option
  }

  const paths: HandledRouteOptions = {}
  for (const key in vueSources) {
    const source = vueSources[key]
    const option = resolveImport([key, source as unknown as ImportMeta])
    option.cfg = cfg[option.fullUrl]
    paths[option.fullUrl] = option
  }

  return resolveSubPath(paths)
}

export interface PageConfig {
  redirect?: RouteRecordRedirectOption
  meta?: RouteMeta &
    Record<string, SafeAny> & {
      hidden?: boolean
      disabled?: boolean
      hasRoles?: string[]
      hasDepts?: string[]
      requireDepts?: string[]
      requireRoles?: string[]
      hasPermissions?: string[]
      requirePermissions?: string[]
      requireLogin?: boolean
    }
}

/**
 * meta 的配置
 */
export type PageConfigRouterMeta = PageConfig['meta']

export function defineAutoRoute(cfg?: PageConfig): Late<PageConfig> {
  return cfg
}

export type BeforeEach = (to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) => void

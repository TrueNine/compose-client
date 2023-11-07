import {type Late, STR_EMPTY, STR_SLASH} from '@compose/compose-types'
import type {RouteRecordRaw} from 'vue-router'

import {camelTo} from '../tools/Strings' // 定义路由处理选项的接口

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

// 定义已处理的路由选项
export type HandledRouteOptions = Record<string, HandleRouteOption>

// 页面路径常量
export const PAGE = 'pages'
export const SUB_PAGE = 'SubPage'
export const NAME_LINK = '___'
export const VIEW_PAGE = 'View'

// 解析导入路径
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

  const name = url.slice(1).replaceAll(STR_SLASH, '-') || '-'
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
    result.parentUrl = paths.slice(0, -1).join(STR_EMPTY)
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

// 解析子路径
export function resolveSubPath(pathRouteOption: HandledRouteOptions): CustomRouteRecordRaw[] {
  const all: HandleRouteOption[] = []
  const view: HandleRouteOption[] = []

  // 将路由选项分为普通页面和视图页面
  Object.entries(pathRouteOption).forEach(x => {
    if (x[1].isView) view.push(x[1])
    else all.push(x[1])
  })

  // 处理普通页面的路由
  const allRoutes: Late<CustomRouteRecordRaw>[] = all.map(e => {
    return {
      path: e.url,
      name: e.name,
      components: {
        default: e.source
      },
      children: [],
      meta: (e.cfg?.source as object) ?? {},
      fullPath: e.fullUrl
    } as CustomRouteRecordRaw
  })

  const result: CustomRouteRecordRaw[] = []

  for (let i = 0; i < allRoutes.length; i++) {
    const e = allRoutes[i]
    if (!e) continue
    const opt = all.find(r => r.name === e?.name)!
    if (opt.isSubPage || opt.isFolderSubPage) {
      allRoutes.find(r => r?.fullPath === opt?.parentUrl)?.children?.push(e)
      //allRoutes[i] = undefined
    } else result.push(e)
  }

  function cleanFirstSlash(path: string): string {
    if (path === STR_SLASH) return STR_SLASH
    return path[0] === STR_SLASH ? path.replace(STR_SLASH, STR_EMPTY) : path
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

  // 处理视图页面的路由
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

// 解析路由
export function resolveRouters(): RouteRecordRaw[] {
  const cfgSources = import.meta.glob([`/**/pages/**/**.page.ts`, `/**/pages/**/**.page.js`], {eager: true, import: 'default'})
  const vueSources = import.meta.glob([`/**/pages/**/**.vue`, `/**/pages/**/**.jsx`, `/**/pages/**/**.tsx`])

  // 解析配置文件
  const cfg = Object.entries(cfgSources)
    .map(e => resolveImport(e as unknown as [string, ImportMeta]))
    .map(e => ({[e.fullUrl]: e}))
    .reduce((acc, cur) => ({...acc, ...cur}), {} as HandledRouteOptions)

  // 解析页面文件
  const paths = Object.entries(vueSources)
    .map(v => resolveImport(v as unknown as [string, ImportMeta]))
    .map(e => ({[e.fullUrl]: {...e, cfg: cfg[e.fullUrl]}}))
    .reduce((acc, cur) => ({...acc, ...cur}), {} as HandledRouteOptions)

  return resolveSubPath(paths)
}

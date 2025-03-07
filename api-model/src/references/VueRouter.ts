import type {late} from '@compose/api-types'
import type {RouteRecordRaw} from 'vue-router'
import type {AutoRouterConfig} from '@compose/api-types'

import {STR_EMPTY, STR_SLASH} from '@/consts'
import {camelTo} from '@/tools'

// 定义路由处理选项的接口
interface HandleRouteOption {
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

type HandledRouteOptions = Record<string, HandleRouteOption>
type CustomRouteRecordRaw = RouteRecordRaw & {
  fullPath: string
}

const PAGE = 'pages'
const SUB_PAGE = 'SubPage'
const VIEW_PAGE = 'View'

function resolvePageConfigToConfig(importMeta?: HandleRouteOption) {
  return importMeta ? (importMeta.source as unknown as late<AutoRouterConfig>) : void 0
}

function processUrlAndName(tp: [string, ImportMeta]) {
  const metaUrl = tp[0]
  const source = tp[1]
  const paths = metaUrl.split(PAGE).filter(Boolean).slice(1).join('').split('/').filter(Boolean)
  const fileName = paths.pop()
  if (!fileName) {
    throw new Error('fileName is not end with page')
  }
  if (paths.length === 0) paths.push(STR_SLASH)
  if (paths[0] !== STR_SLASH) paths.unshift(STR_SLASH)
  const isFn = typeof source === 'function'
  const isView = fileName.includes(VIEW_PAGE)
  const isFolderSubPage = paths.length > 1
  const isSubPage = fileName.includes(SUB_PAGE)
  const url = paths.join(STR_SLASH).replace(`${STR_SLASH}${STR_SLASH}`, STR_SLASH)
  // TODO fileName +
  const name = fileName + url.slice(1).replace(new RegExp(STR_SLASH, 'g'), '-') || '-'
  return {
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
}

export function resolveImport(tp: [string, ImportMeta]): HandleRouteOption {
  const r: HandleRouteOption = processUrlAndName(tp)
  if (r.isFolderSubPage && !(r.isSubPage || r.isView)) {
    r.url = r.paths[r.paths.length - 1]
    r.parentUrl = r.paths.slice(0, -1).join(STR_SLASH).replace(`${STR_SLASH}${STR_SLASH}`, STR_SLASH)
  }
  if (r.isSubPage) {
    r.url = camelTo(r.fileName.split(SUB_PAGE)[0], STR_SLASH)
    r.name = r.name + '-' + camelTo(r.fileName.split(SUB_PAGE)[0], STR_SLASH)
  }
  if (r.isView) {
    r.url = camelTo(r.fileName.split(VIEW_PAGE)[0], STR_SLASH)
    r.name = r.name + '-' + camelTo(r.fileName.split(VIEW_PAGE)[0], STR_SLASH)
  }
  if (r.isSubPage || r.isView) {
    r.parentUrl = r.url
    r.paths.push(r.url)
    r.fullUrl = `${r.parentUrl}${STR_SLASH}${r.url}`
  }
  return r
}

export function resolveSubPath(pathRouteOption: HandledRouteOptions): CustomRouteRecordRaw[] {
  const all: HandleRouteOption[] = []
  const view: HandleRouteOption[] = []
  for (const key in pathRouteOption) {
    const option = pathRouteOption[key]
    if (option.isView) view.push(option)
    else all.push(option)
  }
  // 获取所有路由
  const allRoutes = all.map(e => {
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

  // 开始构建路由
  const result: CustomRouteRecordRaw[] = []
  for (const e of allRoutes) {
    const opt = all.find(r => r.name === e.name)
    if (!opt) throw new Error(`router is not found`)
    if (opt.isSubPage || opt.isFolderSubPage) {
      const parent = allRoutes.find(r => r.fullPath === opt.parentUrl)
      if (parent) parent.children?.push(e)
    } else result.push(e)
  }

  function cleanFirstSlash(path: string): string {
    if (path === STR_SLASH) return STR_SLASH
    return path.startsWith(STR_SLASH) ? path.substring(1) : path
  }

  function deepFind(routes: RouteRecordRaw[], paths: late<string[]> = void 0, startLength = 0, last: late<RouteRecordRaw> = void 0): late<RouteRecordRaw> {
    if (!paths || paths.length === 0) return void 0
    if (routes.length === 0 && startLength === 0) return void 0
    if (paths.length === startLength) return last
    const currentPath = paths[startLength]
    for (const e of routes) {
      if (cleanFirstSlash(currentPath) === cleanFirstSlash(e.path)) {
        return deepFind(e.children ?? [], paths, startLength + 1, e)
      }
    }
    return void 0
  }

  view.forEach(e => {
    const root = deepFind(result, e.paths.slice(0, -1))
    if (root && root.children !== void 0) {
      const child = root.children
      const initPath = child.find(e => e.path === STR_EMPTY)
      if (initPath?.components) initPath.components[e.name] = e.source
      else child.push({path: STR_EMPTY, name: root.name, components: {[e.name]: e.source}})
    }
  })
  return result
}

/**
 * ## 获取 `import.meta.glob` 下的路由
 *
 * 该函数为起点函数
 * @return `RouteRecordRaw[]` 解析后的路由函数
 * @deprecated 可读性不佳
 */
export function resolveRouters(): RouteRecordRaw[] {
  const cfgSources = import.meta.glob([`/**/pages/**/**.page.ts`, `/**/pages/**/**.page.js`], {eager: true, import: 'default'})
  const vueSources = import.meta.glob([`/**/pages/**/**.vue`, `/**/pages/**/**.jsx`, `/**/pages/**/**.tsx`])
  const cfg: HandledRouteOptions = {}
  for (const key in cfgSources) {
    const source = cfgSources[key]
    const option = resolveImport([key, source as ImportMeta])
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

/**
 * ## 定义路由的类型辅助函数
 *
 * @param cfg 路由自定义配置
 * @deprecated 可读性不佳
 */
export function defineAutoRoute(cfg?: AutoRouterConfig): late<AutoRouterConfig> {
  return cfg
}

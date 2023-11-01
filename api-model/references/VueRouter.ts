import {type Late, STR_EMPTY, STR_SLASH} from '@compose/compose-types'
import type {RouteRecordRaw} from 'vue-router'

import {camelTo} from '../tools/Strings'
import {cloneDeep} from '../references/LodashEs'

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
  const isFn = typeof source === 'function'
  const isSubPage = fileName.includes(SUB_PAGE)
  const isView = fileName.includes(VIEW_PAGE)
  const url = `/${paths.join(STR_SLASH)}`

  if (paths.length === 0) paths.push(STR_SLASH)

  const name = url.replaceAll(STR_SLASH, '-').slice(1) || '-'
  const result: HandleRouteOption = {
    url,
    isView,
    isSubPage,
    metaUrl,
    source,
    isFn,
    paths,
    fileName,
    name,
    fullUrl: 'undefined'
  }

  if (isSubPage || isView) {
    if (isSubPage) result.url = camelTo(fileName.split(SUB_PAGE)[0], STR_SLASH)
    if (isView) result.url = camelTo(fileName.split(VIEW_PAGE)[0], STR_SLASH)
    result.parentUrl = url
    result.paths.push(result.url)
    result.name = `${result.parentUrl.slice(1).replaceAll(STR_SLASH, '-') || '-'}${NAME_LINK}${result.url.replaceAll(STR_SLASH, '-') || '-'}`
  }

  result.fullUrl = isSubPage ? `${result.parentUrl}${STR_SLASH}${result.url}` : result.url

  return result
}

// 解析子路径
export function resolveSubPath(pathRouteOption: HandledRouteOptions): RouteRecordRaw[] {
  const all: HandleRouteOption[] = []
  const view: HandleRouteOption[] = []

  // 将路由选项分为普通页面和视图页面
  Object.entries(pathRouteOption).forEach(x => {
    if (x[1].isView) view.push(x[1])
    else all.push(x[1])
  })

  // 处理普通页面的路由
  const allRoutes: Late<RouteRecordRaw>[] = all.map(e => {
    return {
      path: e.url,
      name: e.name,
      components: {
        default: e.source
      },
      children: [],
      meta: (e.cfg?.source as object) ?? {}
    } as RouteRecordRaw
  })

  const result: RouteRecordRaw[] = []

  for (let i = 0; i < allRoutes.length; i++) {
    const e = allRoutes[i]
    if (!e) continue
    const opt = all.find(r => r.url === e?.path)!
    if (opt.isSubPage) {
      allRoutes.find(r => r?.path === opt.parentUrl)?.children?.push(cloneDeep(e))
      allRoutes[i] = undefined
    } else {
      result.push(e)
    }
  }

  // 处理视图页面的路由
  view.forEach(e => {
    const root = result.find(r => r.path === e.parentUrl)
    if (root && root.children) {
      const child = root.children
      /*
       * 找到 根路由
       * 将子路
       * */
      const initPath = child.find(e => e.path === STR_EMPTY)
      if (initPath) initPath.components![e.name] = e.source
      else child.push({path: STR_EMPTY, components: {[e.name]: e.source}})
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

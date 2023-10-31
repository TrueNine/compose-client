import {STR_SLASH, type Late} from '@compose/compose-types'
import {camelTo} from '../tools/Strings'
import type {RouteRecordRaw} from 'vue-router'
import {cloneDeep} from '../references/LodashEs'

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

  const isFn = typeof source === 'function'
  const isSubPage = fileName.includes(SUB_PAGE)
  const isView = fileName.includes(VIEW_PAGE)

  const url = `/${paths.join('/')}`
  if (paths.length === 0) paths.push('/')
  const name = url.replaceAll('/', '-').slice(1) || '-'

  const result: HandleRouteOption = {url, isView, isSubPage, metaUrl, source, isFn, paths, fileName, name, fullUrl: 'undefined'}
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

export function resolveSubPath(pathRouteOption: HandledRouteOptions): RouteRecordRaw[] {
  let all: HandleRouteOption[] = []
  const view: HandleRouteOption[] = []

  Object.entries(pathRouteOption).forEach(([_, opt]) => {
    if (opt.isView) view.push(opt)
    else all.push(opt)
  })

  const allRoutes: Late<RouteRecordRaw>[] = all.map(e => {
    return {
      path: e.url,
      name: e.name,
      components: {
        default: e.source
      },
      children: [],
      meta: (e.cfg?.source as {}) ?? {}
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
  view.forEach(e => {
    const finded = result.find(r => r.path === e.parentUrl)
    if (finded && finded.components) {
      finded.components[e.name] = e.source
      console.log(result)
    }
  })

  return result
}

export function resolveRouters(): RouteRecordRaw[] {
  const cfgSources = import.meta.glob([`/**/pages/**/**.page.ts`, `/**/pages/**/**.page.js`], {eager: true, import: 'default'})
  const vueSources = import.meta.glob([`/**/pages/**/**.vue`, `/**/pages/**/**.jsx`, `/**/pages/**/**.tsx`])

  const cfg = Object.entries(cfgSources)
    .map(e => resolveImport(e as unknown as [string, ImportMeta]))
    .map(e => ({[e.fullUrl]: e}))
    .reduce((acc, cur) => ({...acc, ...cur}), {} as HandledRouteOptions)

  const paths = Object.entries(vueSources)
    .map(v => resolveImport(v as unknown as [string, ImportMeta]))
    .map(e => ({[e.fullUrl]: {...e, cfg: cfg[e.fullUrl]}}))
    .reduce((acc, cur) => ({...acc, ...cur}), {} as HandledRouteOptions)

  resolveSubPath(paths)

  return Object.entries(paths).map(([k, v]) => {
    let meta = undefined
    const path = k
    if (v?.cfg?.source) meta = v.cfg.source
    return {
      path,
      name: v.name,
      component: v.source,
      meta
    } as RouteRecordRaw
  })
}

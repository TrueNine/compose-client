import {EMPTY_STR} from '@compose/compose-types'
import type {RouteRecordRaw} from 'vue-router'

export const PAGE = 'pages'
export const SUB_PAGE = 'SubPage'

export function resolveImport(tp: [string, ImportMeta]) {
  const __metaUrl = tp[0]
  const source = tp[1]
  const isFn = typeof source === 'function'
  const eer = __metaUrl.split(PAGE).filter(Boolean)
  eer.shift()
  const paths = eer.join('').split('/').filter(Boolean)
  const fileName = paths[paths.length - 1]
  paths.pop()

  const url = `/${paths.join('/')}`
  const name = url.replaceAll('/', '-') || '-'

  const isChildren = url.includes(EMPTY_STR)
  if (paths.length === 0) paths.push('/')

  const isSubPage = __metaUrl.includes(SUB_PAGE)

  return {url, isChildren, isSubPage, __metaUrl, source, isFn, paths, fileName, name}
}

export function resolveRouters() {
  const cfgSources = import.meta.glob([`/**/pages/**/**.page.ts`, `/**/pages/**/**.page.js`], {eager: true, import: 'default'})
  const vueSources = import.meta.glob([`/**/pages/**/**.vue`, `/**/pages/**/**.jsx`, `/**/pages/**/**.tsx`])

  const cfg = Object.entries(cfgSources)
    .map(e => {
      return resolveImport(e as unknown as [string, ImportMeta])
    })
    .map(e => {
      return {[e.url]: e}
    })
    .reduce((acc, cur) => {
      return {...acc, ...cur}
    }, {})

  const paths = Object.entries(vueSources)
    .map(v => resolveImport(v as unknown as [string, ImportMeta]))
    .map(e => {
      return {[e.url]: {...e, cfg: cfg[e.url]}}
    })
    .reduce((acc, cur) => {
      return {...acc, ...cur}
    }, {})

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

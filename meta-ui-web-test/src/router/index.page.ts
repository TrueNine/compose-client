import {createMemoryHistory, createRouter, createWebHistory, type RouteRecordRaw} from 'vue-router'
import type {KnownAsTypeMap} from 'vite'
import type {SafeAny} from '@compose/compose-types'

type KnownMap = () => Promise<string extends keyof KnownAsTypeMap ? KnownAsTypeMap[string] : SafeAny>

function a() {
  const firstPath = `/src/pages`

  function resolveImport(tp: [string, KnownMap]) {
    const __metaUrl = tp[0]
    const fn = tp[1]
    const paths = __metaUrl.replace(firstPath, '').split('/').filter(Boolean)
    const fileName = paths.pop()
    let url = paths.join('/')
    url = `/${url}`
    const name = url.replaceAll('/', '-')
    const isChildren = url.includes('/')
    if (paths.length === 0) paths.push('/')
    return {url, isChildren, __metaUrl, fn, paths, fileName, name}
  }

  const cfg = Object.entries(import.meta.glob(`/src/pages/**/**.page.ts`, {eager: true, import: 'default'}))
    .map(e => {
      return resolveImport(e)
    })
    .map(e => {
      return {[e.url]: e}
    })
    .reduce((acc, cur) => {
      return {...acc, ...cur}
    }, {})
  const paths = Object.entries(import.meta.glob(`/src/pages/**/**.vue`))
    .map(v => resolveImport(v))
    .map(e => {
      return {[e.url]: {...e, cfg: cfg[e.url]}}
    })
    .reduce((acc, cur) => {
      return {...acc, ...cur}
    }, {})

  const ab = Object.entries(paths).map(([k, v]) => {
    let meta = undefined
    const path = k
    if (v?.cfg?.fn) meta = v.cfg.fn
    return {
      path,
      name: v.name,
      component: v.fn,
      meta
    } as RouteRecordRaw
  })

  if (ab.every(e => e.path === '/')) {
    ab.push({
      path: '',
      redirect: '/'
    })
  }

  return ab
}

const Router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: a()
})
console.log(Router.getRoutes())
export {Router}
export default Router

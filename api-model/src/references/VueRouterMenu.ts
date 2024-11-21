import type {RouteRecordRaw} from 'vue-router'
import type {AutoRouterConfig, late, Maybe} from '@compose/api-types'

import {STR_EMPTY, STR_SLASH} from '@/consts'

type RouteMatch = RouteRecordRaw & {
  fullPath: string
  parentPath: string
}
type Raw = AutoRouterConfig & RouteMatch
type RouteMatchFn = (r: Raw) => boolean

type MenuObject = {
  uri: string
  path: string
  fullPath: string
  parentPath: string
  name?: string
  iconName?: string
  tags?: Maybe<string>
  sub?: MenuObject[]
} & RouteRecordRaw

function combineURIs(uri1: string, uri2: string): string {
  if (!uri1.startsWith(STR_SLASH)) uri1 = STR_SLASH + uri1
  uri1 = uri1.replace(/\/$/, STR_EMPTY)
  uri2 = uri2.replace(/^\//, STR_EMPTY)
  if (!uri1 && !uri2) return STR_EMPTY
  if (!uri1) return uri2
  const result = `${uri1}${STR_SLASH}${uri2}`
  return result.replace(/\/$/, STR_EMPTY)
}

/**
 *
 * @param routes
 * @param matchFn
 * @param clipPath
 */
export function generateMenu(routes: RouteRecordRaw[], matchFn: late<RouteMatchFn> = void 0, clipPath: late<string> = void 0): MenuObject[] {
  return generateMenuInternal(routes, matchFn, clipPath)

  function generateMenuInternal(
    routes: RouteRecordRaw[],
    matchFn: late<RouteMatchFn> = void 0,
    clipPath: late<string> = void 0,
    parentPath: string = '',
    deepLevel = 0
  ): MenuObject[] {
    if (!deepLevel && clipPath) routes = clip(routes, clipPath)
    return routes
      .filter(route => {
        return matchFn
          ? matchFn({
              redirect: route.redirect,
              ...route,
              fullPath: combineURIs(parentPath, route.path),
              parentPath
            } as Raw)
          : true
      })
      .map(route => {
        const {meta = {}} = route
        const menuObj: MenuObject = {
          ...route,
          fullPath: combineURIs(parentPath, route.path),
          parentPath,
          uri: route.path.replace(/^\/+/, STR_EMPTY),
          name: meta?.title as late<string>
        }
        if (route.children) {
          menuObj.sub = generateMenuInternal(route.children, matchFn, clipPath, combineURIs(parentPath, route.path), deepLevel + 1)
        }
        return menuObj
      })

    function clip(routes: RouteRecordRaw[], clipPath: string): RouteRecordRaw[] {
      for (const r of routes) {
        const fullPath = combineURIs(parentPath, r.path)
        if (fullPath.startsWith(clipPath) || fullPath.startsWith(clipPath + STR_SLASH)) return [...(r.children ?? [])]
        else if (r.children) return clip(r.children, clipPath)
      }
      return []
    }
  }
}

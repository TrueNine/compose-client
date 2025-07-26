import type { Maybe } from '@truenine/types'
import type { RouteRecordRaw, RouteRecordSingleView } from 'vue-router'

/**
 * 自动路由配置类型
 * @property meta 路由元信息
 * @property redirect 路由重定向
 * @property children 子路由
 */
export interface AutoRouterConfig {
  meta?: Record<string, unknown>
  redirect?: string
  children?: RouteRecordRaw[]
}

// 路径常量
const STR_EMPTY = ''
const STR_SLASH = '/'

/**
 * 路由匹配信息
 * @property fullPath 完整路径
 * @property parentPath 父级路径
 */
interface RouteMatch {
  fullPath: string
  parentPath: string
}

/**
 * 原始路由类型，聚合自动路由配置、单视图路由和匹配信息
 */
type Raw = AutoRouterConfig & RouteRecordSingleView & RouteMatch

/**
 * 路由匹配函数类型
 * @param r 路由对象
 * @returns 是否匹配
 */
type RouteMatchFn = (r: Raw) => boolean

/**
 * 菜单对象类型，扩展自 Vue Router 路由记录
 */
type MenuObject = RouteRecordRaw & {
  uri: string
  path: string
  fullPath: string
  parentPath: string
  name?: string
  iconName?: string
  tags?: Maybe<string>
  sub?: MenuObject[]
}

/**
 * 合并两个 URI 路径
 * @param uri1 路径1
 * @param uri2 路径2
 * @returns 合并后的路径
 */
function combineURIs(uri1: string, uri2: string): string {
  const normalizedUri1 = uri1.replace(/^\/+/g, STR_EMPTY).replace(/\/+$/g, STR_EMPTY)
  const normalizedUri2 = uri2.replace(/^\/+/g, STR_EMPTY).replace(/\/+$/g, STR_EMPTY)

  if (!normalizedUri1 && !normalizedUri2) {
    return STR_EMPTY
  }
  if (!normalizedUri1) {
    return normalizedUri2
  }
  if (!normalizedUri2) {
    return normalizedUri1
  }
  return `${normalizedUri1}${STR_SLASH}${normalizedUri2}`
}

/**
 * 按裁剪路径过滤路由
 * @param routes 路由数组
 * @param clipPath 裁剪路径
 * @param parentPath 父路径
 * @returns 剩余路由
 */
function clipRoutes(routes: RouteRecordRaw[], clipPath: string, parentPath = ''): RouteRecordRaw[] {
  const normalizedClipPath = clipPath.replace(/^\/+/g, STR_EMPTY).replace(/\/+$/g, STR_EMPTY)

  for (const route of routes) {
    const fullPath = combineURIs(parentPath, route.path)
    if (fullPath === normalizedClipPath) {
      return route.children ?? []
    }
    const children = route.children
    if (Array.isArray(children) && children.length > 0) {
      const clippedChildren = clipRoutes(children, clipPath, fullPath)
      if (clippedChildren.length > 0) {
        return clippedChildren
      }
    }
  }
  return []
}

/**
 * 路由转菜单对象
 * @param route 路由配置
 * @param parentPath 父路径
 * @param matchFn 匹配函数
 * @returns 菜单对象或 null
 */
function routeToMenuObject(
  route: RouteRecordRaw,
  parentPath: string,
  matchFn?: RouteMatchFn,
): MenuObject | null {
  const fullPath = combineURIs(parentPath, route.path)

  if (matchFn) {
    const raw = {
      ...route,
      fullPath,
      parentPath,
    } as Raw
    if (!matchFn(raw)) {
      return null
    }
  }

  const { meta = {} } = route
  if (meta.hidden === true) {
    return null
  }

  const menuObj: MenuObject = {
    ...route,
    fullPath,
    parentPath,
    uri: route.path.replace(/^\/+/, ''),
    name: typeof meta.title === 'string' ? meta.title : void 0,
  }

  const children = route.children
  if (!Array.isArray(children) || children.length === 0) {
    return menuObj
  }

  const indexRoute = children.find((child): child is RouteRecordRaw & { meta?: Record<string, unknown> } => child.path === STR_EMPTY)
  if (indexRoute != null) {
    const indexMeta = (typeof indexRoute.meta === 'object' && indexRoute.meta !== null) ? indexRoute.meta as Record<string, unknown> : {}
    menuObj.meta = { ...menuObj.meta, ...indexMeta }
    if (typeof indexMeta.title === 'string') {
      menuObj.name = indexMeta.title
    }
    const remainingChildren = children.filter((child) => child.path !== STR_EMPTY)
    let indexSub: MenuObject[] = []
    if (Array.isArray(indexRoute.children) && indexRoute.children.length > 0) {
      indexSub = generateMenuInternal(indexRoute.children, matchFn, null, fullPath)
    }
    let otherSub: MenuObject[] = []
    if (remainingChildren.length > 0) {
      otherSub = generateMenuInternal(remainingChildren, matchFn, null, fullPath)
    }
    const mergedSub = [...indexSub, ...otherSub]
    if (mergedSub.length > 0) {
      menuObj.sub = mergedSub
    }
    return menuObj
  }

  // 无 index 路由，递归所有子路由
  const sub = generateMenuInternal(children, matchFn, null, fullPath)
  if (sub.length > 0) {
    menuObj.sub = sub
  }
  return menuObj
}

/**
 * 菜单生成内部实现
 * @param routes 路由数组
 * @param matchFn 匹配函数
 * @param clipPath 裁剪路径
 * @param parentPath 父路径
 * @returns 菜单对象数组
 */
function generateMenuInternal(
  routes: RouteRecordRaw[],
  matchFn?: RouteMatchFn,
  clipPath: string | null = null,
  parentPath = '',
): MenuObject[] {
  const hasValidClipPath = typeof clipPath === 'string' && clipPath.length > 0
  const routesToProcess = hasValidClipPath ? clipRoutes(routes, clipPath) : routes
  return routesToProcess
    .map((route) => routeToMenuObject(route, parentPath, matchFn))
    .filter((menu): menu is MenuObject => menu !== null)
}

/**
 * 路由转菜单入口
 * @param routes 路由数组
 * @param matchFn 匹配函数
 * @param clipPath 裁剪路径
 * @returns 菜单对象数组
 */
export function generateMenu(
  routes: RouteRecordRaw[],
  matchFn?: RouteMatchFn,
  clipPath?: string,
): MenuObject[] {
  return generateMenuInternal(routes, matchFn, clipPath ?? null)
}

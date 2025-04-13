import type { AutoRouterConfig, Maybe } from '@compose/api-types'
import type { RouteRecordRaw, RouteRecordSingleView } from 'vue-router'

// 常量定义
const STR_EMPTY = ''
const STR_SLASH = '/'

/**
 * 路由匹配的基础类型
 */
interface RouteMatch {
  fullPath: string
  parentPath: string
}

/**
 * 原始路由配置类型
 * 组合了自动路由配置、单视图路由记录和路由匹配类型
 */
type Raw = AutoRouterConfig & RouteRecordSingleView & RouteMatch

/**
 * 路由匹配函数类型
 */
type RouteMatchFn = (r: Raw) => boolean

/**
 * 菜单对象类型
 * 扩展了 Vue Router 的路由记录类型
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
 *
 * @param uri1 - 第一个 URI 路径
 * @param uri2 - 第二个 URI 路径
 * @returns 合并后的 URI 路径
 * @example
 * combineURIs('/foo', 'bar') // 返回 '/foo/bar'
 * combineURIs('foo', '/bar') // 返回 '/foo/bar'
 */
function combineURIs(uri1: string, uri2: string): string {
  const normalizedUri1 = uri1.startsWith(STR_SLASH) ? uri1 : STR_SLASH + uri1
  const trimmedUri1 = normalizedUri1.replace(/\/$/, STR_EMPTY)
  const trimmedUri2 = uri2.replace(/^\//, STR_EMPTY)

  if (!trimmedUri1 && !trimmedUri2) {
    return STR_EMPTY
  }
  if (!trimmedUri1) {
    return trimmedUri2
  }

  const result = `${trimmedUri1}${STR_SLASH}${trimmedUri2}`
  return result.replace(/\/$/, STR_EMPTY)
}

/**
 * 根据裁剪路径过滤路由配置
 *
 * @param routes - 路由配置数组
 * @param clipPath - 裁剪路径
 * @param parentPath - 父级路径
 * @returns 过滤后的路由配置数组
 */
function clipRoutes(routes: RouteRecordRaw[], clipPath: string, parentPath = ''): RouteRecordRaw[] {
  for (const route of routes) {
    const fullPath = combineURIs(parentPath, route.path)
    const hasClipPath = typeof clipPath === 'string' && clipPath.length > 0

    if (fullPath === clipPath || (hasClipPath && fullPath.startsWith(clipPath + STR_SLASH))) {
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
 * 将路由配置转换为菜单对象
 *
 * @param route - 路由配置
 * @param parentPath - 父级路径
 * @param matchFn - 可选的路由匹配函数
 * @returns 转换后的菜单对象，如果不匹配则返回 null
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
  const menuObj: MenuObject = {
    ...route,
    fullPath,
    parentPath,
    uri: route.path.replace(/^\/+/, STR_EMPTY),
    name: meta.title as string | undefined,
  }

  const children = route.children
  if (Array.isArray(children) && children.length > 0) {
    const sub = generateMenuInternal(children, matchFn, null, fullPath)
    if (sub.length > 0) {
      menuObj.sub = sub
    }
  }

  return menuObj
}

/**
 * 内部菜单生成函数
 *
 * @param routes - 路由配置数组
 * @param matchFn - 可选的路由匹配函数
 * @param clipPath - 可选的裁剪路径
 * @param parentPath - 父级路径
 * @returns 生成的菜单对象数组
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
 * 根据路由配置生成菜单
 *
 * 此函数将 Vue Router 的路由配置转换为菜单对象数组。
 * 支持路由过滤、路径裁剪和自定义匹配规则。
 *
 * @param routes - 路由配置数组
 * @param matchFn - 可选的路由匹配函数，用于过滤路由
 * @param clipPath - 可选的裁剪路径，用于从特定路径开始生成菜单
 * @returns 生成的菜单对象数组
 *
 * @example
 * ```typescript
 * const routes = [
 *   {
 *     path: '/dashboard',
 *     meta: { title: '仪表盘' },
 *     children: [
 *       { path: 'analysis', meta: { title: '分析页' } }
 *     ]
 *   }
 * ]
 *
 * const menu = generateMenu(routes)
 * ```
 */
export function generateMenu(
  routes: RouteRecordRaw[],
  matchFn?: RouteMatchFn,
  clipPath?: string,
): MenuObject[] {
  return generateMenuInternal(routes, matchFn, clipPath ?? null)
}

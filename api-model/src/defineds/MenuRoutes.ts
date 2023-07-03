import type {Nullable} from './DataType'
import type {HexColor} from './DataType'
/**
 * # 路由选项
 */
export interface RouteOption {
  name: string
  uri?: string
  href?: string
  iconName?: string
  iconColor?: HexColor
  /**
   * ### 必须拥有的权限
   * 优先级最大，配置此项，其必须包含
   */
  requirePermissions?: string[]
  /**
   * ### 需要的任意一组权限
   * 其内部配置的权限，只要包含其中任意一组即可
   */
  hasPermissions?: string[][]
  requireLogin?: boolean
  tags?: string[]
  disabled?: true
  sub?: RouteOption[]
}

/**
 * ## 以 uri 查找匹配的路由节点，以 uri 进行匹配
 * @param paths 路径 或路径组
 * @param options 所有节点
 * @param deep 递归层级
 * @param root 根元素
 * @returns 查找到的菜单节点
 */
export function deepfindRouteOptionByUriPath(
  paths: string | string[],
  options: RouteOption[] = [],
  deep = 0,
  root: RouteOption | null = null
): Nullable<RouteOption> {
  if (typeof paths === 'string') paths = paths.split('/')
  if (paths.length === deep) return root
  const filteredPaths = paths.filter(r => r !== '')
  const currentPath = filteredPaths[deep].replace('/', '')
  let result: Nullable<RouteOption> = null
  for (let i = 0; i < options.length; i++) {
    const option = options[i]
    if (option.uri?.replace('/', '') === currentPath) {
      result = deepfindRouteOptionByUriPath(filteredPaths, option.sub ?? [], deep + 1, option)
      break
    }
  }
  return result
}

/**
 * ## 将所有路由选项展开，并去除 sub
 * @param routeOptions 路由选项
 * @param rootPath 起始路径
 * @returns 被摊平的 sub
 */
export function flatRouteOptions(routeOptions: RouteOption[] = [], rootPath = ''): Omit<RouteOption, 'sub'>[] {
  const maybeResult: RouteOption[] = []
  const stack: RouteOption[] = [...routeOptions]
  while (stack.length > 0) {
    const r = stack.pop()!
    r.uri = r.uri ? `${rootPath}${rootPath !== '' ? rootPath : ''}${r.uri || ''}` : r.uri
    if (r.sub) stack.push(...flatRouteOptions(r.sub, r.uri).map(e => ({...e})))
    else maybeResult.push(r)
  }
  return maybeResult.map(r => {
    delete r.sub
    return r
  })
}

/**
 * ## 查找指定路由的父节点
 * @param target 要查找的节点
 * @param roots 根节点
 * @param path 路由父路径
 * @returns 父节点路径
 */
export function findRouteOptionParentPath(target: RouteOption, roots: RouteOption[], path: RouteOption[] = []): RouteOption[] | null {
  for (const itOption of roots) {
    if (itOption.uri?.replace('/', '') === target.uri?.replace('/', '')) return path
    if (itOption.sub) {
      const subPath = findRouteOptionParentPath(target, itOption.sub, [...path, itOption])
      if (subPath) return subPath
    }
  }
  return null
}

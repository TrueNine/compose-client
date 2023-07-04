import type {Nullable} from './DataType'
import type {HexColor} from './DataType'

/**
 * # 路由选项
 */
export interface RouteOption {
  name: string
  uri?: string
  href?: string
  /**
   * ## 图标的全类名
   */
  iconName?: string
  iconColor?: HexColor
  /**
   * ### 图标使用的类
   */
  iconClass?: string
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
 * # 对指定的路由选项进行操作
 * @param routeOptions 需操作的路由选项
 * @returns 操作函数
 */
export function routeOptionStream(routeOptions: readonly RouteOption[] = []) {
  function _getArr(paths: string[] | string = [], sep = '/') {
    return Array.isArray(paths) ? paths : paths?.split(sep)
  }
  function _filterPaths(paths: string[] | string = []): string[] {
    return _getArr(paths).filter(r => r !== '')
  }
  function _getLinkedUri(rootPath: string, uri?: string): string | undefined {
    return uri ? `${rootPath}${rootPath !== '' ? '/' : ''}${uri || ''}` : uri
  }

  /**
   * ## 查找指定节点的路由路径
   * @param paths 查找路径
   * @param findedPaths 路由父路径
   * @returns 父节点路径
   */
  function findRouteOptionPath(paths?: string[] | string, subPath: readonly RouteOption[] = routeOptions, findedPaths: RouteOption[] = []): RouteOption[] {
    if (!paths) return findedPaths
    const pathArray = _filterPaths(paths)
    if (pathArray.length === 0) return findedPaths
    const currentPath = pathArray[0].replace('/', '')
    for (const itOption of subPath) {
      if (itOption.uri?.replace('/', '') === currentPath) {
        const subPath = findRouteOptionPath(pathArray.slice(1), itOption.sub, [...findedPaths, itOption])
        if (subPath) return subPath
      }
    }
    return []
  }

  /**
   * ## 将所有路由选项展开，并去除 sub
   * @param rootPath 起始路径
   * @returns 被摊平的 sub
   */
  function flatRouteOptions(rootPath = '', subPath: readonly RouteOption[] = routeOptions): Omit<RouteOption, 'sub'>[] {
    const maybeResult: RouteOption[] = []
    const stack: RouteOption[] = [...subPath]
    while (stack.length > 0) {
      const r = stack.pop()!
      if (r.sub) stack.push(...flatRouteOptions(_getLinkedUri(rootPath, r.uri) ?? '', r.sub).map(e => ({...e})))
      else maybeResult.push({...r})
    }
    return maybeResult.map(r => {
      delete r.sub
      return {
        ...r,
        uri: _getLinkedUri(rootPath, r.uri)
      }
    })
  }

  /**
   * ## 以 uri 查找匹配的路由选项
   * @param paths 路径 或路径组
   * @param deep 递归层级
   * @param root 根元素
   * @returns 查找到的菜单节点
   */
  function deepfindRouteOptionByUriPath(
    paths: string[] | string,
    options: readonly RouteOption[] = routeOptions,
    deep = 0,
    root: RouteOption | null = null
  ): Nullable<RouteOption> {
    const pathArray = _filterPaths(paths)
    if (pathArray.length === deep || pathArray.length === 0) return root
    const currentPath = pathArray[deep].replace('/', '')
    let result: Nullable<RouteOption> = null
    for (let i = 0; i < options.length; i++) {
      const option = options[i]
      const optionUri = option.uri?.replace('/', '')
      if (optionUri === currentPath) {
        result = deepfindRouteOptionByUriPath(pathArray, [...(option.sub ?? [])], deep + 1, option)
        break
      }
    }
    return result
  }

  return {
    findRouteOptionPath,
    deepfindRouteOptionByUriPath,
    flatRouteOptions
  }
}

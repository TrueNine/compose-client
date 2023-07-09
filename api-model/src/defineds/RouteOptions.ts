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
  /**
   * ### 当前路由是否被禁用
   */
  disabled?: true
  /**
   * ### 是否隐藏当前路由选项，通常用于菜单
   */
  hidden?: true
  sub?: RouteOption[]
}

/**
 * # 对指定的路由选项进行操作
 * @param routeOptions 需操作的路由选项
 * @returns 操作函数
 */
export function routeOptionStream(routeOptions: readonly RouteOption[] = [], routeRootPath = '/') {
  function _pathToRoot(path: string[]) {
    return path.reduce((acc, cur) => acc && (cur === routeRootPath || cur === ''), true)
  }
  function _isRootPath(path: string[]): string[] {
    if ((path.length === 1 || path.length === 2) && _pathToRoot(path)) return ['/']
    else return path
  }
  function _pathToArray(paths: string[] | string = [], sep = '/'): string[] {
    const metaPath = Array.isArray(paths) ? paths : paths.split('?')[0].split(sep)
    return _isRootPath(metaPath)
  }
  function _filterPaths(paths: string[] | string = []): string[] {
    return _pathToArray(paths).filter(r => r !== '')
  }
  function _getLinkedUri(rootPath: string, uri?: string): string | undefined {
    return uri ? `${rootPath}${rootPath !== '' ? routeRootPath : ''}${uri || ''}` : uri
  }

  /**
   * ## 查找指定节点的路由路径
   * @param paths 查找路径
   * @param findedPaths 路由父路径
   * @returns 父节点路径
   */
  function findRouteOptionPath(paths?: string[] | string, subPath: readonly RouteOption[] = routeOptions, findedPaths: RouteOption[] = []): RouteOption[] {
    if (paths?.length === 0) return findedPaths
    const pathArray = _filterPaths(paths)
    if (pathArray.length === 0) return findedPaths
    const currentPath = pathArray[0]
    for (const itOption of subPath) {
      if (itOption.uri === currentPath) return findRouteOptionPath(pathArray.slice(1), itOption.sub ?? [], [...findedPaths, itOption])
    }
    return findedPaths
  }

  function isRequireLogin(path: string[] | string) {
    const current = [...findRouteOptionPath(path)].reverse()
    console.log({
      current
    })
    for (const r of current) {
      if (r.requireLogin) return true
      const hasPermissions = (r.hasPermissions?.length ?? 0) > 0
      const reqPermissions = (r.requirePermissions?.length ?? 0) > 0
      if (hasPermissions || reqPermissions) return true
    }
    return false
  }

  const _hasPermissionsGroup = (require: string[] = [], user: string[] = []) => require.reduce((acc, cur) => acc && user.includes(cur), true)
  /**
   * ## 判断用户是否拥有足够的权限
   * @param fullPath 匹配路由的全路径
   * @param permissions 权限
   * @param defaultAllow 默认规则
   * @returns 是否拥有足够的权限
   */
  function isAllowPermissions(fullPath: string[] | string = [], permissions: string[] = [], defaultAllow = true): boolean {
    const optionPath = [...findRouteOptionPath(fullPath, routeOptions ?? [])]
    if (optionPath.length === 0) return defaultAllow
    for (let i = optionPath.length; i > 0; i--) {
      const option = optionPath[i - 1]
      if (option.requirePermissions) return _hasPermissionsGroup(option.requirePermissions, permissions)
      if (option.hasPermissions) {
        const r = option.hasPermissions
        for (let j = 0; j < r.length; j++) {
          const require = r[j]
          if (_hasPermissionsGroup(require, permissions)) return true
        }
        return false
      }
    }
    return defaultAllow
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
   * @returns 返回所有不带 hidden 属性的路由
   */
  function toShow(): RouteOption[] {
    const _newRouteOption = [...routeOptions]
    function _deep(sub: RouteOption[] = _newRouteOption) {
      return sub
        .filter(r => {
          if (r.hidden) return false
          return true
        })
        .map(r => {
          const _n = {...r}
          if (r.sub) _n.sub = _deep(r.sub)
          return _n
        })
    }
    return _deep(_newRouteOption)
  }

  /**
   * ## 以 uri 查找匹配的路由选项
   * @param paths 路径 或路径组
   * @param deep 递归层级
   * @param root 根元素
   * @returns 查找到的菜单节点
   */
  function deepfindRouteOptionByUriPath(
    paths: string[] | string = [],
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
      if (option.uri === currentPath) {
        result = deepfindRouteOptionByUriPath(pathArray, [...(option.sub ?? [])], deep + 1, option)
        break
      }
    }
    return result
  }

  return {
    findRouteOptionPath,
    deepfindRouteOptionByUriPath,
    flatRouteOptions,
    isAllowPermissions,
    isRequireLogin,
    toShow
  }
}

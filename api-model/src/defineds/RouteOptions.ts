import type {MaybeReadonlyArray, nil, RouteOption} from '@compose/api-types'

import {STR_EMPTY} from '@/consts/Strings'
import {cloneDeep} from '@/references/LodashEs'
import {maybeReadonlyArray} from '@/tools/Array'

interface MatchConfig {
  hidden?: boolean
  roles?: string[]
  permissions?: string[]
  matchRole?: boolean
  matchPermissions?: boolean
  login?: boolean
}

/**
 * # 对指定的路由选项进行操作
 * @param routeOptions 需操作的路由选项
 * @param routeRootPath 路由根路径
 * @deprecated 改使用类的方式调用
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
    return _pathToArray(paths).filter(r => r !== STR_EMPTY)
  }

  function _getLinkedUri(rootPath: string, uri?: string): string | undefined {
    return uri ? `${rootPath}${rootPath !== '' ? routeRootPath : ''}${uri || ''}` : uri
  }

  /**
   * ## 查找指定节点的路由路径
   * @param paths 查找路径
   * @param subPaths 无需传递
   * @param foundPaths 路由父路径
   * @returns 父节点路径
   */
  function findRouteOptionPath(
    paths?: string[] | string,
    subPaths: MaybeReadonlyArray<RouteOption> = routeOptions,
    foundPaths: RouteOption[] = []
  ): RouteOption[] {
    const _sub = maybeReadonlyArray(subPaths)
    if (paths?.length === 0) return foundPaths
    const pathArray = _filterPaths(paths)
    if (pathArray.length === 0) return foundPaths
    const currentPath = pathArray[0]
    for (const itOption of _sub) {
      if (itOption.uri === currentPath) return findRouteOptionPath(pathArray.slice(1), itOption.sub ?? [], [...foundPaths, itOption])
    }
    return foundPaths
  }

  function isRequireLogin(path: string[] | string) {
    const current = cloneDeep(findRouteOptionPath(path)).reverse()
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
    const optionPath = cloneDeep(findRouteOptionPath(fullPath, routeOptions ?? []))
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
   * @param subPath 无需填写
   * @returns 被摊平的 sub
   */
  function flatRouteOptions(rootPath = '', subPath: readonly RouteOption[] = routeOptions): Omit<RouteOption, 'sub'>[] {
    const maybeResult: RouteOption[] = []
    const stack: RouteOption[] = cloneDeep([...subPath])
    while (stack.length > 0) {
      const r = stack.pop()!
      if (r.sub) stack.push(...flatRouteOptions(_getLinkedUri(rootPath, r.uri) ?? '', r.sub).map(e => ({...e})))
      else maybeResult.push(cloneDeep(r))
    }
    return maybeResult.map(r => {
      delete r.sub
      return {
        ...r,
        uri: _getLinkedUri(rootPath, r.uri)
      }
    })
  }

  const defaultClipConfig: MatchConfig = {
    matchRole: true,
    matchPermissions: true,
    hidden: true
  }

  /**
   * ### 递归裁剪不需要的菜单选项
   * @param config 匹配配置
   * @param deep 无需传递
   */
  function matchClip(config?: nil<MatchConfig>, deep: readonly RouteOption[] = routeOptions) {
    const c = Object.assign(config ?? {}, defaultClipConfig)
    const r = config?.roles ?? []
    const p = config?.permissions ?? []

    let _deep = cloneDeep([...deep]).filter(d => d !== null) as (RouteOption | null)[]
    for (let i = 0; i < _deep.length; i++) {
      const a = _deep[i]
      if (a) {
        if (a.requireLogin && !c.login) {
          _deep[i] = null // 需要登录
          continue
        } else if (a.requirePermissions && c.matchPermissions) {
          if (!a.requirePermissions.every(e => p.includes(e)) || !c.permissions) {
            _deep[i] = null
            continue
          }
        } else if (a.requireRoles && c.roles && c.matchRole) {
          if (!a.requireRoles.every(e => r.includes(e)) || !c.roles) {
            _deep[i] = null
            continue
          }
        } else if (a.hidden && c.hidden) {
          _deep[i] = null
          continue
        }
        if (a.sub) a.sub = matchClip(c, a.sub)
      }
    }

    _deep = _deep.filter(d => d !== null) as RouteOption[]
    return _deep as RouteOption[]
  }

  /**
   * @returns 返回所有不带 hidden 属性的路由
   */
  function toShow(): RouteOption[] {
    const _newRouteOption = cloneDeep([...routeOptions])

    function _deep(sub: RouteOption[] = _newRouteOption) {
      return sub
        .filter(r => {
          return !r.hidden
        })
        .map(r => {
          const _n = cloneDeep(r)
          if (r.sub) _n.sub = _deep(r.sub)
          return _n
        })
    }

    return _deep(_newRouteOption)
  }

  /**
   * ## 以 uri 查找匹配的路由选项
   * @param paths 路径 或路径组
   * @param options 路由选项
   * @param deep 递归层级
   * @param root 根元素
   * @returns 查找到的菜单节点
   */
  function deepFindRouteOptionByUriPath(
    paths: string[] | string = [],
    options: readonly RouteOption[] = routeOptions,
    deep = 0,
    root: RouteOption | null = null
  ): nil<RouteOption> {
    const pathArray = _filterPaths(paths)
    if (pathArray.length === deep || pathArray.length === 0) return root
    const currentPath = pathArray[deep].replace('/', '')
    let result: nil<RouteOption> = null
    for (let i = 0; i < options.length; i++) {
      const option = options[i]
      if (option.uri === currentPath) {
        result = deepFindRouteOptionByUriPath(pathArray, [...(option.sub ?? [])], deep + 1, option)
        break
      }
    }
    return result
  }

  return {
    findRouteOptionPath,
    flatRouteOptions,
    isAllowPermissions,
    isRequireLogin,
    deepFindRouteOptionByUriPath,
    toShow,
    matchClip
  }
}

import type {Maybe, MaybeReadonlyArray, Nullable, RouteOption} from '@compose/api-types'
import {STR_EMPTY, STR_SLASH} from '../consts/Strings'
import type {RouteRecordRaw} from 'vue-router'
import type {AutoRouterPageConfigRouterMeta} from '@compose/api-types'

import {maybeArray, maybeReadonlyArray} from '../tools'
import {cloneDeep} from '../references'

interface MatchConfig {
  hidden?: boolean
  roles?: MaybeReadonlyArray<string>
  allowUndefined?: boolean
  permissions?: MaybeReadonlyArray<string>
  matchRole?: boolean
  matchPermissions?: boolean
  login?: boolean
}

/**
 * ## 路由选项流式操作API
 */
export class RouteStream {
  private static readonly _SLASH = STR_SLASH
  private readonly _routeTable: readonly RouteOption[]
  private _roles: readonly string[]
  private _permissions: readonly string[]
  private _rootPath: string
  private _allowUndefined: boolean

  private static _defaultClipConfig: MatchConfig = {
    matchRole: true,
    matchPermissions: true,
    hidden: true
  }

  constructor(routeTable: Maybe<RouteOption>, matchConfig: MatchConfig = RouteStream._defaultClipConfig, rootPath: string = RouteStream._SLASH) {
    routeTable = cloneDeep(routeTable)
    matchConfig = cloneDeep(matchConfig)
    this._routeTable = maybeArray(routeTable)
    this._allowUndefined = matchConfig.allowUndefined ?? true
    this._permissions = maybeReadonlyArray(matchConfig.permissions ?? [])
    this._roles = maybeReadonlyArray(matchConfig.roles ?? [])
    this._rootPath = rootPath
  }

  getVisible(): readonly RouteOption[] {
    const _newRouteOption = cloneDeep(this._routeTable)

    function _deep(sub = _newRouteOption) {
      return sub
        .filter(r => Boolean(!r))
        .map(r => {
          const _n = cloneDeep(r)
          if (r.sub) _n.sub = _deep(r.sub)
          return _n
        })
    }

    return _deep(_newRouteOption)
  }

  /**
   * @deprecated 已经过时
   * @param config
   * @param deep
   */
  matchClip(config: Nullable<MatchConfig> = RouteStream._defaultClipConfig, deep: MaybeReadonlyArray<RouteOption> = this._routeTable) {
    const c = Object.assign(config ?? {}, RouteStream._defaultClipConfig)
    const r = config?.roles ?? []
    const p = config?.permissions ?? []
    let _deepResult = maybeReadonlyArray(deep).filter(d => d !== null) as (RouteOption | null)[]

    for (let i = 0; i < _deepResult.length; i++) {
      const currentRoute = _deepResult[i]
      if (currentRoute) {
        if (currentRoute.requireLogin && !c.login) {
          _deepResult[i] = null // 需要登录
          continue
        } else if (currentRoute.requirePermissions && c.matchPermissions) {
          if (!currentRoute.requirePermissions.every(e => maybeArray(p).includes(e)) || !c.permissions) {
            _deepResult[i] = null
            continue
          }
        } else if (currentRoute.requireRoles && c.roles && c.matchRole) {
          if (!currentRoute.requireRoles.every(e => maybeArray(r).includes(e)) || !c.roles) {
            _deepResult[i] = null
            continue
          }
        } else if (currentRoute.hidden && c.hidden) {
          _deepResult[i] = null
          continue
        }
        if (currentRoute.sub) currentRoute.sub = this.matchClip(c, currentRoute.sub)
      }
    }

    _deepResult = _deepResult.filter(d => d !== null) as RouteOption[]
    return _deepResult as RouteOption[]
  }

  flat(rootPath = STR_EMPTY, subPath: MaybeReadonlyArray<RouteOption> = this._routeTable): Omit<RouteOption, 'sub'>[] {
    const maybeResult: RouteOption[] = []
    const stack: RouteOption[] = cloneDeep(maybeArray(subPath))
    while (stack.length > 0) {
      const r = stack.pop()!
      if (r.sub)
        stack.push(...this.flat(this._getLinkedUri(rootPath, r.uri) ?? STR_EMPTY, r.sub).map(e => cloneDeep(e))) // TODO 测试 clone 机制
      else maybeResult.push(r)
    }
    return maybeResult.map(r => {
      delete r.sub
      return {
        ...r,
        uri: this._getLinkedUri(rootPath, r.uri)
      }
    })
  }

  deepFindRouteOptionByUriPath(
    paths: MaybeReadonlyArray<string> = [],
    options: readonly RouteOption[] = this._routeTable,
    deepLevel = 0,
    root: Nullable<RouteOption> = null
  ): Nullable<RouteOption> {
    const pathArray = this._cleanPaths(paths)
    if (pathArray.length === deepLevel || pathArray.length === 0) return root
    const currentPath = pathArray[deepLevel].replace(RouteStream._SLASH, STR_EMPTY)
    let result: Nullable<RouteOption> = null
    for (let i = 0; i < options.length; i++) {
      const option = options[i]
      if (option.uri === currentPath) {
        result = this.deepFindRouteOptionByUriPath(pathArray, [...(option.sub ?? [])], deepLevel + 1, option)
        break
      }
    }
    return result
  }

  /**
   * @deprecated 已过时
   * @param fullPath
   * @param permissions
   * @param defaultAllow
   */
  isAllowPermissions(
    fullPath: MaybeReadonlyArray<string> = [],
    permissions: MaybeReadonlyArray<string> = this._permissions,
    defaultAllow = this._allowUndefined
  ): boolean {
    const optionPath = this.findRouteOptionByPath(fullPath, this._routeTable)
    if (optionPath.length === 0) return defaultAllow
    for (let i = optionPath.length; i > 0; i--) {
      const option = optionPath[i - 1]
      if (option.requirePermissions) return this._hasPermissionsGroup(option.requirePermissions, permissions)
      if (option.hasPermissions) {
        const r = option.hasPermissions
        for (let j = 0; j < r.length; j++) {
          const require = r[j]
          if (this._hasPermissionsGroup(require, permissions)) return true
        }
        return false
      }
    }
    return defaultAllow
  }

  /**
   * @deprecated 已经过时
   * @param paths
   */
  isRequireLogin(paths: Maybe<string>) {
    const current = this.findRouteOptionByPath(paths).reverse()
    for (const r of current) {
      if (r.requireLogin) return true
      const hasPermissions = (r.hasPermissions?.length ?? 0) > 0
      const reqPermissions = (r.requirePermissions?.length ?? 0) > 0
      if (hasPermissions || reqPermissions) return true
    }
    return false
  }

  findRouteOptionByPath(
    paths: MaybeReadonlyArray<string>,
    clippedRouteTable: MaybeReadonlyArray<RouteOption> = this._routeTable,
    foundRouteOptions: MaybeReadonlyArray<RouteOption> = []
  ): RouteOption[] {
    const _sub = maybeReadonlyArray(clippedRouteTable)
    if (paths?.length === 0) return maybeArray(foundRouteOptions)
    const cleanedPaths = this._cleanPaths(paths)
    if (cleanedPaths.length === 0) return maybeArray(foundRouteOptions)
    const currentPath = cleanedPaths[0]
    for (const itOption of _sub) {
      if (itOption.uri === currentPath)
        return this.findRouteOptionByPath(cleanedPaths.slice(1), itOption.sub ?? [], [...maybeArray(foundRouteOptions), itOption])
    }
    return maybeArray(foundRouteOptions)
  }

  private _hasPermissionsGroup(require: MaybeReadonlyArray<string> = [], user: MaybeReadonlyArray<string> = []) {
    return maybeReadonlyArray(require).every(d => maybeReadonlyArray(user).includes(d))
  }

  private _getLinkedUri(rootPath: string, uri?: string): string | undefined {
    return uri ? `${rootPath}${rootPath !== STR_EMPTY ? RouteStream._SLASH : STR_EMPTY}${uri || STR_EMPTY}` : uri
  }

  private _isRootPath(paths: Maybe<string>): boolean {
    return maybeReadonlyArray(paths).every(p => p === this._rootPath || p === STR_EMPTY)
  }

  private _cleanPaths(paths: MaybeReadonlyArray<string>): readonly string[] {
    const p = maybeArray(paths)
      .map(p => p.split(RouteStream._SLASH))
      .flat()
      .filter(e => e !== STR_EMPTY)
      .map(p => p.split('?')[0])
    if ((p.length === 1 || p.length === 2) && this._isRootPath(p)) return [RouteStream._SLASH]
    else return p
  }

  set rootPath(path: string) {
    this._rootPath = path
  }

  get rootPath() {
    return this._rootPath
  }

  set allowUndefined(allow: boolean) {
    this._allowUndefined = allow
  }

  get allowUndefined() {
    return this._allowUndefined
  }

  set permissions(permissions: Maybe<string>) {
    this._permissions = maybeArray(permissions)
  }

  get permissions(): readonly string[] {
    return this._permissions
  }

  set roles(roles: Maybe<string>) {
    this._roles = maybeArray(roles)
  }

  get roles(): readonly string[] {
    return this._roles
  }
}

function _toRouteTable(raw: RouteRecordRaw[], parent?: RouteOption) {
  return raw
    .map(e => {
      const meta = e.meta as unknown as AutoRouterPageConfigRouterMeta
      let path: string
      if (parent) {
        if (parent.uri && parent.uri !== STR_SLASH) {
          path = e.path
        } else path = e.path
      } else path = STR_SLASH
      if (e.path === STR_EMPTY) return undefined

      const o = {
        uri: path,
        ...meta
      } as RouteOption
      o.sub = e.children ? _toRouteTable(e.children, o) : []
      return o
    })
    .filter(Boolean) as RouteOption[]
}

export function toRouteTable(raw: RouteRecordRaw[]) {
  return _toRouteTable(raw)
}

import type {Nullable} from './DataType'
import type {HexColor} from './DataType'

export interface RouteOption {
  name: string
  uri?: string
  href?: string
  iconName?: string
  iconColor?: HexColor
  requirePermissions?: string[]
  requireLogin?: boolean
  tags?: string[]
  disabled?: true
  sub?: RouteOption[]
}

/**
 * ## 以 uri 查找匹配的菜单节点，以 uri 进行匹配
 * @param paths 路径
 * @param subs 菜单的所有节点
 * @param deep 递归层级
 * @param root 根元素
 * @returns 查找到的菜单节点
 */
export function deepMenuByUriPath(paths: string[], subs: RouteOption[] = [], deep = 0, root: RouteOption | null = null): Nullable<RouteOption> {
  if (paths.length === deep) return root
  paths = paths.filter(r => r !== '')
  let result: Nullable<RouteOption> = null
  for (let i = 0; i < subs.length; i++) {
    const it = subs[i]
    if (it.uri?.replace('/', '') === paths[deep]) {
      result = deepMenuByUriPath(paths, it.sub ?? [], deep + 1, it)
      break
    }
  }
  return result
}
/**
 *
 * @param menus 菜单
 * @param rootPath 起始路径
 * @returns 被摊平的 sub
 */
export function flatMenus(menus: RouteOption[] = [], rootPath = ''): RouteOption[] {
  const maybeResult: RouteOption[] = []
  menus.forEach(r => {
    r.uri = r.uri ? `${rootPath}/${r.uri || ''}` : r.uri
    if (r.sub) maybeResult.push(...flatMenus(r.sub, r.uri).map(e => ({...e, sub: []})))
    else maybeResult.push(r)
  })
  return maybeResult
}

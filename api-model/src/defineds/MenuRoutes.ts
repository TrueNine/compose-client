import {Nullable} from './DataType'

export interface RouteOption {
  name: string
  uri?: string
  href?: string
  iconName?: string
  requirePermissions?: string[]
  requireLogin?: boolean
  tags?: string[]
  disabled?: true
  sub?: RouteOption[]
}

/**
 * ## 以 url 查找匹配的菜单节点，以 uri 进行匹配
 * @param paths 路径
 * @param subs 菜单的所有节点
 * @param deep 递归层级
 * @param root 根元素
 * @returns 查找到的菜单节点
 */
export function findMenu(paths: string[], subs: RouteOption[] = [], deep = 0, root: RouteOption | null = null): Nullable<RouteOption> {
  if (paths.length === deep) return root
  let result: Nullable<RouteOption> = null
  for (let i = 0; i < subs.length; i++) {
    const it = subs[i]
    if (it.uri?.replace('/', '') === paths[deep]) {
      result = findMenu(paths, it.sub ?? [], deep + 1, it)
      break
    }
  }
  return result
}

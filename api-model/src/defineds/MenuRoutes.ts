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
 * @param deep 递归层级
 * @param root 根元素
 * @param subs 子节点
 * @returns 查找到的菜单节点
 */
export function findMenu(paths: string[], deep = 0, root: RouteOption | null = null, subs: RouteOption[] = []): Nullable<RouteOption> {
  if (paths.length === deep) return root
  let result: Nullable<RouteOption> = null
  for (let i = 0; i < subs.length; i++) {
    const it = subs[i]
    if (it.uri?.replace('/', '') === paths[deep]) {
      result = findMenu(paths, deep + 1, it, it.sub ?? [])
      break
    }
  }
  return result
}

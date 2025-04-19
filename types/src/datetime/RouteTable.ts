import type { HexColor } from '@/stylesheet'

interface RouteOptionStyle {
  iconName?: string
  /**
   * @deprecated
   */
  iconClass?: string
  iconColor?: HexColor
  tags?: string[]
  tagsColor?: HexColor
  /**
   * ### 是否隐藏当前路由选项，通常用于菜单
   */
  hidden?: true

  /**
   * ### 当前路由是否被禁用
   */
  disabled?: true
}

interface RouteOptionPermissionControl {
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
  requireRoles?: string[]
  hasRoles?: string[][]

  requireDepts?: string[]
  hasDepts?: string[][]

  requireLogin?: boolean
}

/**
 * # 路由选项
 */
export interface RouteOption extends RouteOptionStyle, RouteOptionPermissionControl {
  name: string
  uri?: string
  href?: string

  /**
   * ### 该路由的子路由
   */
  sub?: RouteOption[]
}

import type {HexColor} from '@/stylesheet'

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
  requireRoles?: string[]
  hasRoles?: string[][]
  requireLogin?: boolean
  tags?: string[]

  requireDepts?: string[]
  hasDepts?: string[]
  /**
   * ### 当前路由是否被禁用
   */
  disabled?: true
  /**
   * ### 是否隐藏当前路由选项，通常用于菜单
   */
  hidden?: true
  /**
   * ### 该路由的子路由
   */
  sub?: RouteOption[]
}

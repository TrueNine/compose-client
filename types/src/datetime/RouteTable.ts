import type {HexColor} from '@/stylesheet'

interface RouteOptionStyle {
  iconName?: string
  iconClass?: string
  iconColor?: HexColor
  tags?: string[]
  tagsColor?: HexColor
  hidden?: true

  disabled?: true
}

interface RouteOptionPermissionControl {
  requirePermissions?: string[]
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

  sub?: RouteOption[]
}

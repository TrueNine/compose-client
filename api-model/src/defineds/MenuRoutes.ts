export interface RouteOption {
  name: string
  uri?: string
  href?: string
  requirePermissions?: string[]
  requireLogin?: boolean
  tags?: string[]
  disabled?: true
  sub?: RouteOption[]
}

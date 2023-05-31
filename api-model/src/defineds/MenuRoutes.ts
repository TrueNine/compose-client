export interface RouteOption {
  name: string
  uri?: string
  href?: string
  tags?: string[]
  disabled?: true
  sub?: RouteOption[]
}

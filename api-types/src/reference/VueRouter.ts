import type {RouteMeta, RouteRecordRedirectOption} from 'vue-router'

import type {dynamic} from '@/typescripts'

/**
 * 自动路由页面 meta 配置
 */
export type AutoRouterPageConfigRouterMeta = {
  hidden?: boolean
  disabled?: boolean
  hasRoles?: string[]
  hasDepts?: string[]
  requireDepts?: string[]
  requireRoles?: string[]
  hasPermissions?: string[]
  requirePermissions?: string[]
  requireLogin?: boolean
} & {
  title?: string
}

/**
 * 自动路由页面配置
 */
export interface AutoRouterPageConfig {
  redirect?: RouteRecordRedirectOption
  meta?: RouteMeta & Record<string, dynamic> & AutoRouterPageConfigRouterMeta
}

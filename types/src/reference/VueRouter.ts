import type { RouteMeta, RouteRecordRedirectOption } from 'vue-router'

import type { dynamic } from '@/typescripts'

interface AutoRouterPageConfig {
  title?: string
}
interface AutoRouterMobilePageConfig {
  /**
   * ## 移动端开启底部导航
   */
  enableBottomBar?: boolean
}
interface AutoRouterPageMenuConfig {
  hidden?: boolean
  disabled?: boolean
}
interface AutoRouterAuthConfig {
  hasRoles?: string[]
  hasDepts?: string[]
  requireDepts?: string[]
  requireRoles?: string[]
  hasPermissions?: string[]
  requirePermissions?: string[]
  requireLogin?: boolean
}
/**
 * 自动路由页面 meta 配置
 */
export interface AutoRouterPageConfigRouterMeta {
  mobilePage?: AutoRouterMobilePageConfig
  menu?: AutoRouterPageMenuConfig
  auth?: AutoRouterAuthConfig
  page?: AutoRouterPageConfig
  /**
   * @deprecated use munu
   * @see munu
   */
  hidden?: boolean
  /**
   * @deprecated use menu
   * @see menu
   */
  disabled?: boolean
  /**
   * @deprecated use auth
   * @see munu
   */
  hasRoles?: string[]
  /**
   * @deprecated use auth
   * @see munu
   */
  hasDepts?: string[]
  /**
   * @deprecated use auth
   * @see munu
   */
  requireDepts?: string[]
  /**
   * @deprecated use auth
   * @see auth
   */
  requireRoles?: string[]
  /**
   * @deprecated use auth
   * @see auth
   */
  hasPermissions?: string[]
  /**
   * @deprecated use auth
   * @see auth
   */
  requirePermissions?: string[]
  /**
   * @deprecated use auth
   * @see auth
   */
  requireLogin?: boolean
  /**
   * @deprecated use page
   * @see page.title
   */
  title?: string
}

/**
 * 自动路由页面配置
 */
export interface AutoRouterConfig {
  redirect?: RouteRecordRedirectOption
  meta?: RouteMeta & Record<string, dynamic> & AutoRouterPageConfigRouterMeta
}

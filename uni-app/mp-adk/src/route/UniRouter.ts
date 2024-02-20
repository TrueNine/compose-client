import {queryParam} from '@compose/req'

export interface RoutingOption {
  url: string
  [key: string]: unknown
}

/**
 * ## 路由到指定路径
 * @param pathBy 路径，不需要 /
 */
function push(pathBy: string | RoutingOption) {
  let u: string
  if (pathBy instanceof Object) {
    u = `/${pathBy.url}`
    pathBy.url = null as unknown as string
    u += queryParam(pathBy)
  } else u = `/${pathBy}`
  // 当找不到页面，就走 switchTab
  const errors: unknown[] = []
  let completed = false
  uni.navigateTo({
    url: u,
    success: () => (completed = true),
    fail: e => {
      errors.push(e)
      uni.switchTab({
        url: u,
        fail: e => errors.push(e),
        success: () => (completed = true),
        complete: () => (completed = true)
      })
    }
  })
  while (completed);
  errors.forEach(e => console.error(e))
}

/**
 * ## 向后退回路由
 */
function back() {
  uni.navigateBack()
}

/**
 * uni app 页面路由
 */
export function useRouter() {
  return {push, back}
}

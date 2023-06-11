/**
 * ## 路由到指定路径
 * @param path 路径，不需要 /
 */
function push(path: string) {
  uni.navigateTo({
    url: `/${path}`
  })
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

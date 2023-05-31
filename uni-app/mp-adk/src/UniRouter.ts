/**
 * uni app 页面路由
 * @param path 省掉 / 的 path
 */
export function route(path: string) {
  uni.navigateTo({
    url: `/${path}`
  })
}

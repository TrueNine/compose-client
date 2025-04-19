/**
 * 2d 3d 显示模式
 */
export type ViewMode = `${2 | 3}${'d' | 'D'}`
/**
 * ## 地图 id
 */
export type MapStyleIds = `style${string}`

export enum BasicMapZoomType {
  /**
   * 各种地图的默认行为
   */
  DEFAULT,
  /**
   * 以地图中心为缩放基点
   */
  CENTER,
}

export const WEBGL_JS_URL = 'https://map.qq.com/api/gljs'

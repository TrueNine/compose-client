/**
 * 2d 3d 显示模式
 */
export type ViewMode = `${2 | 3}${'d' | 'D'}`
/**
 * ## 地图 id
 */
export type MapStyleIds = `style${string}`

export enum BasicMapZoomType {
  DEFAULT,
  CENTER
}

export const WEBGL_JS_URL = 'https://map.qq.com/api/gljs'

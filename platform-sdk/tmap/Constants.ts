import type {TMap} from './index'

/**
 * 2d 3d 显示模式
 */
export type ViewMode = `${2 | 3}${'d' | 'D'}`
/**
 * ## 地图 id
 */
export type MapStyleIds = `style${number}`

export enum BasicMapZoomType {
  /**
   * 各种地图的默认行为
   */
  DEFAULT,
  /**
   * 以地图中心为缩放基点
   */
  CENTER
}

/**
 * # 动态获取各地图的缩放方式
 */
export class LazyGetMapZoomType {
  /**
   * @param zoomType 缩放参数
   * @return 腾讯地图的缩放级别
   */
  static getTencentMapZoomType(zoomType: BasicMapZoomType): TMap.constants.MAP_ZOOM_TYPE {
    switch (zoomType) {
      case BasicMapZoomType.CENTER:
        return window.TMap.constants.MAP_ZOOM_TYPE.CENTER
      case BasicMapZoomType.DEFAULT:
        return window.TMap.constants.MAP_ZOOM_TYPE.DEFAULT
      default:
        return window.TMap.constants.MAP_ZOOM_TYPE.DEFAULT
    }
  }
}

export const WEBGL_JS_URL = 'https://map.qq.com/api/gljs'

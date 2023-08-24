import type {TMap} from 'compose-tmap'

export {}

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

import type { BasicMapZoomType, MapStyleIds, ViewMode } from '../Constants'
import type { LatLngDataTyping, PointDataTyping } from '../LatLng'

/**
 * # 地图配置参数
 *
 * 通过这个参数来控制初始化地图的中心点、缩放级别、俯仰角度等
 */
export interface MapOptions {
  /**
   * ## 设置地图中心点坐标
   */
  center: LatLngDataTyping
  /**
   * ## 地图中心与地图的偏移 xy
   */
  offset?: PointDataTyping
  /**
   * ## 地图俯仰角
   */
  pitch?: number
  /**
   * ## 设置地图缩放级别
   */
  zoom?: number
  /**
   * ## 2d/3d 展示模式
   */
  viewMode?: ViewMode
  /**
   * ## 地图样式 id
   */
  mapStyleId?: MapStyleIds
  /**
   * ## 最小缩放级别
   */
  minZone?: number
  /**
   * ## 最大缩放级别
   */
  maxZone?: number
  /**
   * ## 地图在水平面上的旋转角度
   * 顺时针方向为正，默认为0
   */
  rotation?: number
  /**
   * ## 地图俯仰角度
   * 取值范围为0~80，默认为0
   */
  scale?: number
  /**
   * ## 鼠标拖动地图是否支持
   */
  draggable?: boolean
  /**
   * ## 鼠标滚轮缩放是否支持
   */
  scrollable?: boolean
  /**
   * ## 调整俯仰角度是否支持
   */
  pitchable?: boolean
  /**
   * ## 俯仰角设置是否支持
   */
  rotatable?: boolean
  /**
   * ## 双击缩放是否支持
   */
  doubleClickZoom?: boolean
  /**
   * ## 地图控件是否显示
   */
  showControl?: boolean
  renderOptions?: unknown
  clip?: unknown

  /**
   * ## 地图缩放类型
   */
  mapZoomType?: BasicMapZoomType
}

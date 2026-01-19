import type {BasicMapZoomType, MapStyleIds, ViewMode} from '../Constants'
import type {LatLngDataTyping, PointDataTyping} from '../LatLng'

/**
 * # 地图配置参数
 *
 * 通过这个参数来控制初始化地图的中心点、缩放级别、俯仰角度等
 */
export interface MapOptions {
  center: LatLngDataTyping
  offset?: PointDataTyping
  pitch?: number
  zoom?: number
  viewMode?: ViewMode
  mapStyleId?: MapStyleIds
  minZone?: number
  maxZone?: number
  rotation?: number
  scale?: number
  draggable?: boolean
  scrollable?: boolean
  pitchable?: boolean
  rotatable?: boolean
  doubleClickZoom?: boolean
  showControl?: boolean
  renderOptions?: unknown
  clip?: unknown

  mapZoomType?: BasicMapZoomType
}

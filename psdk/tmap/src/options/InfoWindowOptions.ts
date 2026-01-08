import type {LatLngDataTyping, PointDataTyping} from '../LatLng'
import type {Map} from '../map'

export interface InfoWindowOptions {
  map: Map
  position: LatLngDataTyping
  /**
   * ## 信息窗显示内容
   * 默认为空字符串
   *
   * 当 enableCustom 为 true 时，需传入信息窗体的dom字符串
   */
  content?: string
  enableCustom?: boolean
  zIndex?: number
  offset?: PointDataTyping
}

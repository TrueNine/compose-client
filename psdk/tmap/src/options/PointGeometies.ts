import type {MapStyleIds} from '../Constants'
import type {LatLngDataTyping} from '../LatLng'

/**
 * # 点图形数据
 */
export interface PointGeometry {
  rank?: number
  position: LatLngDataTyping

  id?: string
  styleId?: MapStyleIds

  properties?: object

  markerAnimation?: unknown
}

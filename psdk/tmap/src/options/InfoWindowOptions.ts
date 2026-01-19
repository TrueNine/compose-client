import type {LatLngDataTyping, PointDataTyping} from '../LatLng'
import type {Map} from '../map'

export interface InfoWindowOptions {
  map: Map
  position: LatLngDataTyping
  content?: string
  enableCustom?: boolean
  zIndex?: number
  offset?: PointDataTyping
}

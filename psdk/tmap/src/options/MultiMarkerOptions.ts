import type {Map} from '../map'
/**
 * # MultiMarker的配置参数
 */
export interface MultiMarkerOptions {
  id?: string
  map: Map
  zIndex?: number
  styles?: Record<string, string>

  enableCollision?: boolean
  geometries?: unknown[]
}

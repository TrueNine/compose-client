export * from './common'
export * from './Constants'
export {
  type InfoWindow,
} from './infowindow'
export * from './LatLng' // 导出实现类

export const MAP_ZOOM_TYPE = { // 定义常量
  DEFAULT: 0,
  CENTER: 1,
} as const

export {
  type LatLng,
  type Point,
} from './LatLng'
export {
  type Map,
} from './map'

export {
  type MultiMarker,
} from './multimarker'
export {
  type Search,
} from './services'
export * from './types'

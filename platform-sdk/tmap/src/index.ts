import type { InfoWindow } from './infowindow'
import type { LatLng, Point } from './LatLng'
import type { Map } from './map'
import type { MultiMarker } from './multimarker'
import type { Search } from './services'

export * from './common'
export * from './Constants'
export * from './LatLng'
export * from './types'

// 导出实现类
export type {
  InfoWindow,
  LatLng,
  Map,
  MultiMarker,
  Point,
  Search,
}

// 定义常量
export const MAP_ZOOM_TYPE = {
  DEFAULT: 0,
  CENTER: 1,
} as const

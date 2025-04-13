import type { MapStyleIds, ViewMode } from './Constants'
import type { MapEvents, MultiMarkerEvents } from './events'
import type { InfoWindow } from './infowindow'
import type { LatLng, LatLngDataTyping, Point, PointDataTyping } from './LatLng'
import type { MultiMarker } from './multimarker'
import type {
  EaseOptions,
  InfoWindowOptions,
  MapOptions,
  MultiMarkerOptions,
  PointGeometry,
} from './options'
import type {
  SearchErrorResult,
  SearchNearbyOptions,
  SearchOptions,
  SearchRegionOptions,
  SearchResult,
} from './options/service'
import type { Search } from './services'

export interface TMapService {
  Search: {
    new (): Search
  }
  SearchErrorResult: SearchErrorResult
  SearchResult: SearchResult
  SearchNearbyOptions: SearchNearbyOptions
  SearchOptions: SearchOptions
  SearchRegionOptions: SearchRegionOptions
}

export interface TMapSDK {
  service: TMapService
  LatLng: new (...args: any[]) => LatLng
  InfoWindow: new (...args: any[]) => InfoWindow
  Point: new (...args: any[]) => Point
  MultiMarker: new (...args: any[]) => MultiMarker
  TMap: new (...args: any[]) => TMap
  constants: {
    MAP_ZOOM_TYPE: {
      DEFAULT: 0
      CENTER: 1
    }
  }
}

export interface TMap {
  // 这里可以添加地图实例的具体属性和方法
}

export interface TMapTypes {
  LatLngDataTyping: LatLngDataTyping
  PointDataTyping: PointDataTyping
  ViewMode: ViewMode
  MultiMarkerEvents: MultiMarkerEvents
  MapStyleIds: MapStyleIds
  MapOptions: MapOptions
  EaseOptions: EaseOptions
  InfoWindowOptions: InfoWindowOptions
  PointGeometry: PointGeometry
  MapEvents: MapEvents
  MultiMarkerOptions: MultiMarkerOptions
}

declare global {
  interface Window {
    TMap: TMapSDK
  }
}

export type {
  EaseOptions,
  InfoWindowOptions,
  LatLngDataTyping,
  MapEvents,
  MapOptions,
  MapStyleIds,
  MultiMarkerEvents,
  MultiMarkerOptions,
  PointDataTyping,
  PointGeometry,
  SearchErrorResult,
  SearchNearbyOptions,
  SearchOptions,
  SearchRegionOptions,
  SearchResult,
  ViewMode,
}

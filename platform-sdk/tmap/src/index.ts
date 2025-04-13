import type { MapStyleIds as ExMapStyleIds, ViewMode as ExViewMode } from './Constants'
import type { MapEvents as ExMapEvents, MultiMarkerEvents as ExMultiMarkerEvents } from './events'
import type { LatLngDataTyping as ExLatLngDataTyping, PointDataTyping as ExPointDataTyping } from './LatLng'
import type {
  EaseOptions as ExEaseOptions,
  InfoWindowOptions as ExInfoWindowOptions,
  MapOptions as ExMapOptions,
  MultiMarkerOptions as ExMultiMarkerOptions,
  PointGeometry as ExPointGeometry,
} from './options'
import type {
  SearchOptions as ExISearchOptions,
  SearchErrorResult as ExSearchErrorResult,
  SearchNearbyOptions as ExSearchNearbyOptions,
  SearchRegionOptions as ExSearchRegionOptions,
  SearchResult as ExSearchResult,
} from './options/service'
import { InfoWindow as ExInfoWindow } from './infowindow'
import { LatLng as ExLatLng, Point as ExPoint } from './LatLng'
import { Map as ExMap } from './map'
import { MultiMarker as ExMultiMarker } from './multimarker'
import { Search as ExSearch } from './services'

export * from './common'
export * from './Constants'
export * from './LatLng'

declare global {
  export namespace TMap {
    export namespace service {
      export type SearchErrorResult = ExSearchErrorResult
      export type SearchResult = ExSearchResult
      export type SearchNearbyOptions = ExSearchNearbyOptions
      export type SearchOptions = ExISearchOptions
      export type SearchRegionOptions = ExSearchRegionOptions

      export class Search extends ExSearch { }
    }

    export type LatLngDataTyping = ExLatLngDataTyping
    export type PointDataTyping = ExPointDataTyping
    export type ViewMode = ExViewMode
    export type MultiMarkerEvents = ExMultiMarkerEvents
    export type MapStyleIds = ExMapStyleIds
    export type MapOptions = ExMapOptions
    export type EaseOptions = ExEaseOptions
    export type InfoWindowOptions = ExInfoWindowOptions
    export type PointGeometry = ExPointGeometry
    export type MapEvents = ExMapEvents
    export type MultiMarkerOptions = ExMultiMarkerOptions

    export class LatLng extends ExLatLng { }

    export class InfoWindow extends ExInfoWindow { }

    export class Point extends ExPoint { }

    export class MultiMarker extends ExMultiMarker { }

    export class Map extends ExMap { }

    export namespace constants {
      export enum MAP_ZOOM_TYPE {
        DEFAULT = 0,
        CENTER = 1,
      }
    }
  }

  export interface Window {
    TMap: typeof TMap
  }
}

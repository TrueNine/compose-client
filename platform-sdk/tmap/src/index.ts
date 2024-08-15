import {LatLng as ExLatLng, type LatLngDataTyping as ExLatLngDataTyping, Point as ExPoint, type PointDataTyping as ExPointDataTyping} from './LatLng'
import type {MapStyleIds as ExMapStyleIds, ViewMode as ExViewMode} from './Constants'
import type {
  EaseOptions as ExEaseOptions,
  InfoWindowOptions as ExInfoWindowOptions,
  MapOptions as ExMapOptions,
  MultiMarkerOptions as ExMultiMarkerOptions,
  PointGeometry as ExPointGeometry
} from './options'
import {InfoWindow as ExInfoWindow} from './infowindow'
import {Map as ExMap} from './map'
import type {MapEvents as ExMapEvents, MultiMarkerEvents as ExMultiMarkerEvents} from './events'
import {MultiMarker as ExMultiMarker} from './multimarker'
import type {
  SearchErrorResult as ExSearchErrorResult,
  SearchNearbyOptions as ExSearchNearbyOptions,
  SearchOptions as ExISearchOptions,
  SearchRegionOptions as ExSearchRegionOptions,
  SearchResult as ExSearchResult
} from './options/service'
import {Search as ExSearch} from './services'

export * from './Constants'
export * from './LatLng'
export * from './common'

declare global {
  export namespace TMap {
    export namespace service {
      export type SearchErrorResult = ExSearchErrorResult
      export type SearchResult = ExSearchResult
      export type SearchNearbyOptions = ExSearchNearbyOptions
      export type SearchOptions = ExISearchOptions
      export type SearchRegionOptions = ExSearchRegionOptions

      export class Search extends ExSearch {}
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

    export class LatLng extends ExLatLng {}

    export class InfoWindow extends ExInfoWindow {}

    export class Point extends ExPoint {}

    export class MultiMarker extends ExMultiMarker {}

    export class Map extends ExMap {}

    export namespace constants {
      export enum MAP_ZOOM_TYPE {
        DEFAULT = 0,
        CENTER = 1
      }
    }
  }

  export interface Window {
    TMap: typeof TMap
  }
}

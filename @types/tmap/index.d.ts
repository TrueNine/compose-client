import {WGS84} from '@compose/api-model'
import {_GeometryOverlayEvent, _InfoWindowEvents, _MapEvent, _MapEvents, _MultiMarkerEvents} from './Events'
import {_PointGeometry} from './PointGeometies'
import {_LatLng, _LatLngDataTyping, _Point} from './Ladlngs'
import {_Map, _MapOptions} from './Map'
import {_InfoWindow, _InfoWindowOptions} from './InfoWindow'
import {_MultiMarker, _MultiMarkerOptions} from './MultiMarker'

/**
 * # 全局地图操作句柄
 */
export declare namespace TMap {
  /**
   * # 地图缓动变化配置参数
   * 可控制动画时长等。
   */
  export interface EaseOptions {
    /**
     * ## 毫秒时长 默认 500 ms
     */
    duration?: number
  }

  export type PointDataTyping = WGS84

  export class Point extends _Point {}

  export type MultiMarkerOptions = _MultiMarkerOptions

  export class MultiMarker extends _MultiMarker {}

  export type PointGeometry = _PointGeometry
  export type GeometryOverlayEvent<K extends string> = _GeometryOverlayEvent<K>
  export type MultiMarkerEvents = _MultiMarkerEvents

  export class InfoWindow extends _InfoWindow {}

  export type InfoWindowEvents = _InfoWindowEvents
  export type InfoWindowOptions = _InfoWindowOptions
  export type LatLngDataTyping = _LatLngDataTyping

  export class LatLng extends _LatLng {}

  export class Map extends _Map {}

  export type MapEvent<K extends string> = _MapEvent<K>
  export type MapEvents = _MapEvents
  export type MapOptions = _MapOptions

  /**
   * 2d 3d 显示模式
   */
  export type ViewMode = `${2 | 3}${'d' | 'D'}`

  /**
   * 地图 样式id，需要去后台申请，然后自定义id
   */
  export type MapStyleIds = `style${number}`

  /**
   * ## 数据常量
   */
  export namespace constants {
    /**
     * ### 地图缩放类型
     */
    export enum MAP_ZOOM_TYPE {
      /**
       * 以鼠标指针为基点进行缩放
       */
      DEFAULT,
      /**
       * 以地图中心为基点
       */
      CENTER
    }
  }
}

/**
 * # 腾讯地图 SDK挂载
 * 他妈的邪了门，居然就他妈挂载在 window 上
 * @author TrueNine
 * @since 2023-05-21
 */
declare global {
  import {TMap as e} from './index'

  export interface Window {
    TMap: e
  }
}

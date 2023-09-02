import type {WGS84} from '@compose/api-model'

import {TMap} from './index'

import LatLngDataTyping = TMap.LatLngDataTyping
import PointDataTyping = TMap.PointDataTyping
import LatLng = TMap.LatLng
import MapEvent = TMap.MapEvent
import GeometryOverlayEvent = TMap.GeometryOverlayEvent

/**
 * ## 地图事件类型
 */
export interface _MapEvent<K extends string> extends AbstractTencetnEvent<K, Event, EventTarget> {
  latLng: LatLng
  poi: string | null
  point: WGS84 | null
}

/**
 * ## 腾讯地图抽象事件接口
 */
export interface AbstractTencetnEvent<K extends string, E extends Event, T extends EventTarget> {
  type: K
  target: T
  originalEvent: E
}

export type _GeometryOverlayEvent<K extends string> = {
  geometry: unknown
  latLng: LatLngDataTyping
  point: PointDataTyping
} & AbstractTencetnEvent<K, MouseEvent | TouchEvent, EventTarget>

/**
 * 地图事件
 */
export interface _MapEvents {
  /**
   * 地图进入空闲状态
   */
  idle: null
  /**
   * 可见瓦片加载完毕后
   */
  tilesloaded: null
  click: MapEvent<'click'>
  rightclick: MapEvent<'rightclick'>
  dblclick: MapEvent<'dblclick'>
}

/**
 * ## 信息窗口点击事件
 */
export interface _InfoWindowEvents {
  closeclick: null
}

interface _MultiMarkerEvents {
  click: GeometryOverlayEvent<'click'>
  dblclick: GeometryOverlayEvent<'dbclick'>
  mousedown: GeometryOverlayEvent<'mousedown'>
  mouseup: GeometryOverlayEvent<'mouseup'>
  mousemove: GeometryOverlayEvent<'mousemove'>
  hover: GeometryOverlayEvent<'hover'>
  touchstart: GeometryOverlayEvent<'touchstart'>
}

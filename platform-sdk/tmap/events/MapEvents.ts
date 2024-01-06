import type {Nullable} from '@compose/compose-types'

import {TMap} from '../index'

import type {ITencentEvent} from './Events'

import LatLng = TMap.LatLng
import Point = TMap.Point

/**
 * ## 地图事件类型
 */
export interface MapEvent<K extends string> extends ITencentEvent<K, Event, EventTarget> {
  latLng: LatLng
  poi: {name: string}
  point: Nullable<Point>
}

/**
 * 地图事件
 */
export interface MapEvents {
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

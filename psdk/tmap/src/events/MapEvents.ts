import type {nil} from '@truenine/types'
import type {LatLng, Point} from '../LatLng'
import type {ITencentEvent} from './Events'

/**
 * ## 地图事件类型
 */
export interface MapEvent<K extends string> extends ITencentEvent<K, Event, EventTarget> {
  latLng: LatLng
  poi: {name: string}
  point: nil<Point>
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

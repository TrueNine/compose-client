import {TMap} from './index'
import MultiMarkerOptions = TMap.MultiMarkerOptions
import PointGeometry = TMap.PointGeometry
import Map = TMap.Map
import MultiMarkerEvents = TMap.MultiMarkerEvents

/**
 * # MultiMarker的配置参数
 */
export interface _MultiMarkerOptions {
  /**
   * ## 图层id
   * 若没有会自动分配一个
   */
  id?: string
  map: Map
  zIndex?: number
  styles?: Record<string, string>

  /**
   * ## 开启内部标记碰撞
   */
  enableCollision?: boolean
  geometries?: unknown[]
}

/**
 * # 多 maker 图层
 */
export class _MultiMarker {
  constructor(options: MultiMarkerOptions)

  add(geometries: PointGeometry | PointGeometry[]): this

  setMap(map: Map): this

  setGeometries(geometries: PointGeometry[]): this

  setVisible(visible: boolean): this

  getMap(): Map

  getId(): string

  getGeometries(): PointGeometry[]

  getStyles(): unknown

  getVisible(): boolean

  getGeometryById(id: string): PointGeometry | null

  updateGeometries(geometry: PointGeometry[]): this

  remove(ids: string[]): this

  moveAlong(param: unknown, options: unknown): void

  stopMove(): this

  pauseMove(): this

  resumeMove(): this

  on<K extends keyof MultiMarkerEvents>(eventName: K, listener: (ev: MultiMarkerEvents[K]) => void): this

  off<K extends keyof MultiMarkerEvents>(eventName: K, listener: (ev: MultiMarkerEvents[K]) => void): this
}

import type { MultiMarkerEvents } from '../events'
import type { Map } from '../map'
import type { MultiMarkerOptions } from '../options/MultiMarkerOptions'
import type { PointGeometry } from '../options/PointGeometies'

/**
 * # 多 maker 图层
 */
export declare class MultiMarker {
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

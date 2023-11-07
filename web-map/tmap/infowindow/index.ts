import type {TMap} from '..'
import type {InfoWindowEvents} from '../events'

type InfoWindowOptions = TMap.InfoWindowOptions
type LatLngDataTyping = TMap.LatLngDataTyping
type Map = TMap.Map
/**
 * # 用于创建信息窗覆盖物
 */
export declare class InfoWindow {
  constructor(options: InfoWindowOptions)

  setPosition(position: LatLngDataTyping): TMap.InfoWindow

  setContent(content: string): TMap.InfoWindow

  setMap(map: Map): TMap.InfoWindow

  getMap(): Map

  open(): TMap.InfoWindow

  close(): TMap.InfoWindow

  destroy(): TMap.InfoWindow

  on<K extends keyof InfoWindowEvents>(name: K, listener: (ev: InfoWindowEvents[K]) => void): TMap.InfoWindow
}

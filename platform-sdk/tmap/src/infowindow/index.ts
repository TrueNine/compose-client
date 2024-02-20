import type {InfoWindowEvents} from '@/events'

type InfoWindowOptions = TMap.InfoWindowOptions
type LatLngDataTyping = TMap.LatLngDataTyping
type Map = TMap.Map

/**
 * # 用于创建信息窗覆盖物
 */
export declare class InfoWindow {
  constructor(options: InfoWindowOptions)

  setPosition(position: LatLngDataTyping): InfoWindow

  setContent(content: string): InfoWindow

  setMap(map: Map): InfoWindow

  getMap(): Map

  open(): InfoWindow

  close(): InfoWindow

  destroy(): InfoWindow

  on<K extends keyof InfoWindowEvents>(name: K, listener: (ev: InfoWindowEvents[K]) => void): InfoWindow
}

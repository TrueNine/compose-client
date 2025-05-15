import type { LatLngDataTyping } from '../LatLng'
import type { Map } from '../map'
import type { InfoWindowOptions } from '../options/InfoWindowOptions'
import type { InfoWindowEvents } from '@/events'

/**
 * # 用于创建信息窗覆盖物
 */
declare class InfoWindow {
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

export { InfoWindow }

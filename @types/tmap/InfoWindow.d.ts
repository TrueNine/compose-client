import {TMap} from './index'
import LatLngDataTyping = TMap.LatLngDataTyping
import Map = TMap.Map
import {WGS84} from '../../api-model'
import InfoWindowOptions = TMap.InfoWindowOptions
import InfoWindowEvents = TMap.InfoWindowEvents

interface _InfoWindowOptions {
  map: Map
  position: LatLngDataTyping
  /**
   * ## 信息窗显示内容
   * 默认为空字符串
   *
   * 当 enableCustom 为 true 时，需传入信息窗体的dom字符串
   */
  content?: string
  enableCustom?: boolean
  zIndex?: number
  offset?: WGS84
}

/**
 * # 用于创建信息窗覆盖物
 */
export class _InfoWindow {
  constructor(options: InfoWindowOptions)

  setPosition(position: LatLngDataTyping): void

  setContent(content: string): void

  setMap(map: Map): void

  getMap(): Map

  open(): void

  close(): void

  destroy(): void

  on<K extends keyof InfoWindowEvents>(name: K, listener: (ev: InfoWindowEvents[K]) => void): this
}

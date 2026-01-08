import type {MapStyleIds, ViewMode} from '../Constants'
import type {MapEvents} from '../events'
import type {LatLng, LatLngDataTyping} from '../LatLng'
import type {EaseOptions} from '../options/EaseOptions'
import type {MapOptions} from '../options/MapOptions'

export declare class Map {
  constructor(html: string | HTMLElement, mode: MapOptions)

  /**
   * ## 设置地图的显示模式
   * @param viewMode 显示模式 2d 3d
   */
  setViewMode(viewMode: ViewMode): this

  /**
   * ## 设置3d视角的俯仰角
   * @param pitch 3d视角的俯仰角
   */
  setPitch(pitch: number): this

  /**
   * ## 设置地图样式id
   * @param styleId 样式 id
   */
  setMapStyleId(styleId: MapStyleIds): this

  /**
   * ## 销毁地图
   */
  destroy(): void

  /**
   * ## 将地图中心平滑移动到指定的经纬度坐标
   * @param latLng 经纬度
   * @param ease
   */
  panTo(latLng: LatLngDataTyping, ease?: EaseOptions): this

  /**
   * ## 设置地图缩放级别
   * @param zoom 3 - 20
   */
  setZoom(zoom: number): this

  /**
   * ## 绑定地图事件
   * @param eventName 地图事件名
   * @param listener 地图事件回调
   */
  on<K extends keyof MapEvents>(eventName: K, listener: (ev: MapEvents[K]) => void): this

  startAnimation(keyFrames: unknown[], opts: unknown): this

  stopAnimation(): this

  getCenter(): LatLng

  zoomTo(zoom: number, opts: EaseOptions): this

  setCenter(center: LatLngDataTyping): this
}

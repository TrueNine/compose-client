import type {MapStyleIds, ViewMode} from '../Constants'
import type {MapEvents} from '../events'
import type {LatLng, LatLngDataTyping} from '../LatLng'
import type {EaseOptions} from '../options/EaseOptions'
import type {MapOptions} from '../options/MapOptions'

export declare class Map {
  constructor(html: string | HTMLElement, mode: MapOptions)

  setViewMode(viewMode: ViewMode): this

  setPitch(pitch: number): this

  setMapStyleId(styleId: MapStyleIds): this

  destroy(): void

  panTo(latLng: LatLngDataTyping, ease?: EaseOptions): this

  setZoom(zoom: number): this

  on<K extends keyof MapEvents>(eventName: K, listener: (ev: MapEvents[K]) => void): this

  startAnimation(keyFrames: unknown[], opts: unknown): this

  stopAnimation(): this

  getCenter(): LatLng

  zoomTo(zoom: number, opts: EaseOptions): this

  setCenter(center: LatLngDataTyping): this
}

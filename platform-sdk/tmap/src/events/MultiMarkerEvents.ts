import type {ITencentEvent} from './Events'

type PointDataTyping = TMap.PointDataTyping
type LatLngDataTyping = TMap.LatLngDataTyping

export type GeometryOverlayEvent<K extends string> = {
  geometry: unknown
  latLng: LatLngDataTyping
  point: PointDataTyping
} & ITencentEvent<K, MouseEvent | TouchEvent, EventTarget>

export interface MultiMarkerEvents {
  click: GeometryOverlayEvent<'click'>
  dblclick: GeometryOverlayEvent<'dbclick'>
  mousedown: GeometryOverlayEvent<'mousedown'>
  mouseup: GeometryOverlayEvent<'mouseup'>
  mousemove: GeometryOverlayEvent<'mousemove'>
  hover: GeometryOverlayEvent<'hover'>
  touchstart: GeometryOverlayEvent<'touchstart'>
}

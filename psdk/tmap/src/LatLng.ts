import type {WGS84} from '@truenine/types'

export interface LatLngDataTyping {
  readonly lat: number
  readonly lng: number
  readonly height?: number
}

/**
 * ## 地理位置坐标
 */
export declare class LatLng implements LatLngDataTyping {
  lat: number
  lng: number

  constructor(lat: number, lng: number, height?: number)

  getLat(): number

  getLng(): number
}

/**
 * # x 和 y
 */
export type PointDataTyping = WGS84

/**
 * ## x y 标记
 */
export declare class Point implements PointDataTyping {
  x: number
  y: number

  getX(): number

  getY(): number

  equals(other: Point): boolean

  clone(): Point

  toString(): string
}

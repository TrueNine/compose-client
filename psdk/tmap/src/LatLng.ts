import type { WGS84 } from '@truenine/types'

export interface LatLngDataTyping {
  /**
   * ## 维度
   */
  readonly lat: number
  /**
   * ## 经度
   */
  readonly lng: number
  /**
   * ## 高度??
   */
  readonly height?: number
}

/**
 * ## 地理位置坐标
 */
export declare class LatLng implements LatLngDataTyping {
  lat: number
  lng: number

  /**
   * @param lat 维度
   * @param lng 精度
   * @param height 高度（选填）
   */
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

import { TMap} from "./index";
import Point = TMap.Point;
import PointDataTyping = TMap.PointDataTyping;
import LatLngDataTyping = TMap.LatLngDataTyping;

export interface _LatLngDataTyping {
  /**
   * ## 维度
   */
  lat: number
  /**
   * ## 经度
   */
  lng: number
  /**
   * ## 高度??
   */
  readonly height?: number
}

/**
 * ## x y 标记
 */
export class _Point implements PointDataTyping {
  x: number
  y: number

  getX(): number

  getY(): number

  equals(other: Point): boolean

  clone(): Point

  toString(): string
}

export class _LatLng implements LatLngDataTyping {
  /**
   * @param lat 维度
   * @param lng 精度
   * @param height 高度（选填）
   */
  constructor(lat: number, lng: number, height?: number)

  /**
   * ## 维度
   */
  lat: number
  /**
   * ## 经度
   */
  lng: number
  /**
   * ## 高度??
   */
  readonly height?: number

  getLat(): number

  getLng(): number
}

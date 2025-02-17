import type {BaseOption} from '@/common'
import type {f64} from '@compose/api-types'

export interface GetLocationSuccessResult {
  latitude: f64
  longitude: f64
  /**
   * 速度 米每秒
   */
  speed?: f64
  accuracy?: f64
}

export interface GetLocationOption extends BaseOption<GetLocationSuccessResult> {
  type: 'gjc02' | 'wgs84'
}

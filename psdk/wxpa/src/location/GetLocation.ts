import type {f64} from '@truenine/types'
import type {BaseOption} from '@/common'

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

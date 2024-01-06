import type {Double} from '@compose/api-types'

import type {BaseOption} from '../common'
export interface GetLocationSuccessResult {
  latitude: Double
  longitude: Double
  /**
   * 速度 米每秒
   */
  speed?: Double
  accuracy?: Double
}
export interface GetLocationOption extends BaseOption<GetLocationSuccessResult> {
  type: 'gjc02' | 'wgs84'
}

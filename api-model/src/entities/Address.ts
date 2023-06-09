import {WGS84} from '../defineds/DataType'
import {BaseEntity} from '../entities/BaiscEntities'

/**
 * 五级联动省市区地址
 */
export interface Address {
  code: string
  name: string
  level: number
  center?: WGS84
  leaf: boolean
}

/**
 * 用户地址详情
 */
export interface AddressDetauls extends BaseEntity {
  addressId: number
  addressDetails: string
  center?: WGS84
}

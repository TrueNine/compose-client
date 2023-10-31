import type {WGS84, BaseEntity} from '@compose/compose-types'

/**
 * 五级联动省市区地址
 */
export interface Address extends BaseEntity {
  code: string
  name: string
  level: number
  center?: WGS84
  leaf: boolean
}

/**
 * # 用户地址详情
 */
export interface AddressDetails extends BaseEntity {
  addressId: string
  addressCode?: string
  name?: string
  phone?: string
  userId?: string
  addressDetails: string
  center?: WGS84
}

/**
 * # 全地址
 */
export interface FullAddress extends Address {
  details: AddressDetails[]
}

/**
 * # 全用户地址详情
 */
export interface FullAddressDetails extends AddressDetails {
  address: Address
}

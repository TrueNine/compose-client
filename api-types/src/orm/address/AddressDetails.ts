import type { WGS84 } from '@/map'
import type { Address, IEntity, RefId } from '@/orm'
import type { str } from '@/typescripts'

export interface AddressDetails extends IEntity {
  addressId?: RefId
  phone?: str
  userId: RefId
  name?: str
  addressCode?: str
  addressDetails?: str
  center?: WGS84
}

export interface NonDesensitizedAddressDetails extends AddressDetails {
  phone?: str
  addressDetails: str
  addressCode: str
  name: str
}

export interface FullAddressDetails extends AddressDetails {
  address: Address
}

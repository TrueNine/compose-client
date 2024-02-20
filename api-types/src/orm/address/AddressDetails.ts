import type {IEntity} from '@/orm'
import type {WGS84} from '@/map'
import type {RefId} from '@/orm'
import type {Address} from '@/orm'
import type {serialcode} from '@/typescripts'

export interface AddressDetails extends IEntity {
  addressId?: RefId
  phone?: string
  userId: RefId
  name?: string
  addressCode?: serialcode
  addressDetails?: string
  center?: WGS84
}

export interface NonDesensitizedAddressDetails extends AddressDetails {
  phone?: string
  addressDetails: string
  addressCode: serialcode
  name: string
}

export interface FullAddressDetails extends AddressDetails {
  address: Address
}

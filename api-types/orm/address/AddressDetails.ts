import type {IEntity} from '../Entities'
import type {WGS84} from '../../map'
import type {ReferenceId, SerialCode} from '../Utils'

import type {Address} from './Address'

export interface AddressDetails extends IEntity {
  addressId?: ReferenceId
  phone?: string
  userId: ReferenceId
  name?: string
  addressCode?: SerialCode
  addressDetails?: string
  center?: WGS84
}

export interface NonDesensitizedAddressDetails extends AddressDetails {
  phone?: string
  addressDetails: string
  addressCode: SerialCode
  name: string
}

export interface FullAddressDetails extends AddressDetails {
  address: Address
}

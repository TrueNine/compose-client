import type {IEntity} from '../Entities'
import type {RefId, SerialCode} from '../Utils'
import type {Int} from '../../typescripts'

export interface BankCard extends IEntity {
  userId?: RefId
  reservePhone?: string
  userInfoId?: RefId
  issueAddressDetails?: string
  bankType?: string
  bankGroup?: Int
  country?: Int
  code: SerialCode
}

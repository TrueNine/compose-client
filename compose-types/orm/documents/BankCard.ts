import type {IEntity} from '../Entities'
import type {ReferenceId, SerialCode} from '../Utils'
import type {Int} from '../../typescripts'

export interface BankCard extends IEntity {
  userId: ReferenceId
  issueAddressDetails?: string
  bankType?: string
  bankGroup?: Int
  country?: Int
  code: SerialCode
}

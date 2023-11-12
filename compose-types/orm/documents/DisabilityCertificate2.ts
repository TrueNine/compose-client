import type {IEntity} from '../Entities'
import type {Timestamp} from '../../datetime'
import type {BigSerial, Id, ReferenceId, SerialCode} from '../Utils'
import {GenderTyping} from '../typing'
import type {Int} from '../../typescripts'

export interface DisabilityCertificate2 extends IEntity {
  birthday?: Timestamp
  addressDetailsId?: ReferenceId
  guardianPhone?: string
  guardian?: string
  expireDate?: Timestamp
  issueDate?: Timestamp
  level?: BigSerial
  type?: Int
  gender?: GenderTyping
  code: SerialCode
  name: string
  userId: Id
  disabilityCode: SerialCode
}

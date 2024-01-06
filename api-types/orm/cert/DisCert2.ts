import type {IEntity} from '../Entities'
import type {Timestamp} from '../../datetime'
import type {BigSerial, ReferenceId, RefId, SerialCode} from '../Utils'
import {GenderTyping} from '../typing'
import type {Int} from '../../typescripts'

export interface DisCert2 extends IEntity {
  userId?: RefId
  userInfoId?: RefId

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
  disabilityCode: SerialCode
}

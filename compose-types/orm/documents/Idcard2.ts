import type {IEntity} from '../Entities'
import type {Timestamp} from '../../datetime'
import {GenderTyping} from '../typing'
import type {BigSerial, ReferenceId} from '../Utils'

export interface Idcard2 extends IEntity {
  userId: ReferenceId
  issueOrgan?: string
  expireDate?: Timestamp
  ethnicGroup?: string
  birthday?: Timestamp
  code: BigSerial
  name: string
  gender?: GenderTyping
  addressDetailsId?: ReferenceId
}

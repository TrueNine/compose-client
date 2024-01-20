import type {IEntity} from '../Entities'
import type {Timestamp} from '../../datetime'
import type {GenderTyping} from '@compose/api-model'
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

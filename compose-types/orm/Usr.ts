import type {LocalDateTime} from '../datetime'

import type {IEntity} from './Entities'
import type {BigText, ReferenceId, SerialCode} from './Utils'

export interface Usr extends IEntity {
  readonly band?: boolean
  readonly createUserId?: ReferenceId
  account?: SerialCode
  nickName?: string
  doc?: BigText
  pwdEnc?: BigText
  lastLoginTime?: LocalDateTime
  banTime?: LocalDateTime
}

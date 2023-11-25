import type {LocalDateTime} from '../datetime'

import type {IEntity} from './Entities'
import type {BigText, ReferenceId, SerialCode} from './Utils'

export interface User extends IEntity {
  createUserId?: ReferenceId
  account?: SerialCode
  nickName?: string
  doc?: BigText
  pwdEnc?: BigText
  lastLoginTime?: LocalDateTime
  band?: boolean
  banTime?: LocalDateTime
}

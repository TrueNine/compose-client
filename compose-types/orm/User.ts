import type {Timestamp} from '../datetime'

import type {IEntity} from './Entities'
import type {SerialCode} from './Utils'

export interface User extends IEntity {
  account: SerialCode
  nickName: string
  doc?: string
  pwdEnc?: string
  lastLoginTime?: Timestamp
  band: boolean
  banTime?: Timestamp
}

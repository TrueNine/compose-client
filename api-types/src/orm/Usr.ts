import type { datetime } from '@/datetime'
import type { bool, str } from '@/typescripts'

import type { IEntity } from './Entities'
import type { RefId } from './Utils'

export interface Usr extends IEntity {
  readonly band?: bool
  readonly createUserId?: RefId
  account?: str
  nickName?: str
  doc?: str
  pwdEnc?: str
  lastLoginTime?: datetime
  banTime?: datetime
}

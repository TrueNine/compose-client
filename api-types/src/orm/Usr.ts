import type {IEntity} from './Entities'
import type {RefId} from './Utils'

import type {datetime} from '@/datetime'
import type {bool, str} from '@/typescripts'

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

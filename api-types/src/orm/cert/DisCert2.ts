import type {GenderTyping} from '@compose/api-typings'

import type {IEntity} from '@/orm'
import type {timestamp} from '@/datetime'
import type {RefId} from '@/orm'
import type {i32, i64, str} from '@/typescripts'

export interface DisCert2 extends IEntity {
  userId?: RefId
  userInfoId?: RefId
  birthday?: timestamp
  addressDetailsId?: RefId
  guardianPhone?: str
  guardian?: str
  expireDate?: timestamp
  issueDate?: timestamp
  level?: i64
  type?: i32
  gender?: GenderTyping
  code: str
  name: str
  disabilityCode: str
}

import type { timestamp } from '@/datetime'

import type { IEntity, RefId } from '@/orm'
import type { i32, i64, str } from '@/typescripts'
import type { GenderTyping } from '@compose/api-typings'

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

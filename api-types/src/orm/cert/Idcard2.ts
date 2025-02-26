import type { timestamp } from '@/datetime'

import type { IEntity, RefId } from '@/orm'
import type { GenderTyping } from '@compose/api-typings'

export interface Idcard2 extends IEntity {
  userId: RefId
  issueOrgan?: string
  expireDate?: timestamp
  ethnicGroup?: string
  birthday?: timestamp
  code: string
  name: string
  gender?: GenderTyping
  addressDetailsId?: RefId
}

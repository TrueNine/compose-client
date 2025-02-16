import type {GenderTyping} from '@compose/api-typings'

import type {IEntity} from '@/orm'
import type {timestamp} from '@/datetime'
import type {RefId} from '@/orm'

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

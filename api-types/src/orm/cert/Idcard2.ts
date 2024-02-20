import type {GenderTyping} from '@compose/api-model'

import type {IEntity} from '@/orm'
import type {timestamp} from '@/datetime'
import type {RefId} from '@/orm'
import type {bigserial} from '@/typescripts'

export interface Idcard2 extends IEntity {
  userId: RefId
  issueOrgan?: string
  expireDate?: timestamp
  ethnicGroup?: string
  birthday?: timestamp
  code: bigserial
  name: string
  gender?: GenderTyping
  addressDetailsId?: RefId
}

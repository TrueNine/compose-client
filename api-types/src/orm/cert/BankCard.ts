import type {IEntity} from '@/orm'
import type {RefId} from '@/orm'
import type {int, serialcode} from '@/typescripts'

export interface BankCard extends IEntity {
  userId?: RefId
  reservePhone?: string
  userInfoId?: RefId
  issueAddressDetails?: string
  bankType?: string
  bankGroup?: int
  country?: int
  code: serialcode
}

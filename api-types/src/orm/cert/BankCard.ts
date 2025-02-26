import type { IEntity, RefId } from '@/orm'
import type { i32, str } from '@/typescripts'

export interface BankCard extends IEntity {
  userId?: RefId
  reservePhone?: str
  userInfoId?: RefId
  issueAddressDetails?: str
  bankType?: str
  bankGroup?: i32
  country?: i32
  code: str
}

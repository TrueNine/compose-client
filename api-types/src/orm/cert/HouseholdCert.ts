import type { timestamp } from '@/datetime'

import type { IEntity, RefId } from '@/orm'
import type { decimal, i32, i64, str } from '@/typescripts'
import type { BloodTyping, DegreeTyping, GenderTyping } from '@compose/api-typings'

export interface HouseholdCert extends IEntity {
  userId?: RefId
  userInfoId?: RefId
  issueDate?: timestamp
  serviceAddressDetailsId?: RefId
  militaryServiceStatus: string
  occupation?: string
  educationLevel?: DegreeTyping
  idcardCode?: string
  originAddressDetailsId?: RefId
  placeBirthAddressDetailsId?: RefId
  bloodType?: BloodTyping
  height?: decimal
  birthday?: timestamp
  ethnicGroup?: str
  gender?: GenderTyping
  relationship?: str
  oldName?: str
  name?: str
  issueOrgan?: str
  addressDetailsId?: RefId
  code: i64
  householdPrimaryName?: str
  householdType?: i32
}

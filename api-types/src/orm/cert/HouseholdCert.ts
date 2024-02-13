import type {BloodTyping, DegreeTyping, GenderTyping} from '@compose/api-model'

import type {IEntity} from '@/orm'
import type {RefId} from '@/orm'
import type {timestamp} from '@/datetime'
import type {bigserial, decimal, int} from '@/typescripts'

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
  ethnicGroup?: string
  gender?: GenderTyping
  relationship?: string
  oldName?: string
  name?: string
  issueOrgan?: string
  addressDetailsId?: RefId
  code: bigserial
  householdPrimaryName?: string
  householdType?: int
}

import type {IEntity} from '../Entities'
import type {BigSerial, ReferenceId} from '../Utils'
import type {Timestamp} from '../../datetime'
import {BloodTyping, DegreeTyping, GenderTyping} from '../typing'
import type {Decimal, Int} from '../../typescripts'

export interface HouseholdRegistrationCard extends IEntity {
  userId: ReferenceId
  issueDate?: Timestamp
  serviceAddressDetailsId?: ReferenceId
  militaryServiceStatus: string
  occupation?: string
  educationLevel?: DegreeTyping
  idcardCode?: string
  originAddressDetailsId?: ReferenceId
  placeBirthAddressDetailsId?: ReferenceId
  bloodType?: BloodTyping
  height?: Decimal
  birthday?: Timestamp
  ethnicGroup?: string
  gender?: GenderTyping
  relationship?: string
  oldName?: string
  name?: string
  issueOrgan?: string
  addressDetailsId?: ReferenceId
  code: BigSerial
  householdPrimaryName?: string
  householdType?: Int
}

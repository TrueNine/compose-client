import type {LocalDate} from '../datetime'

import type {GenderTyping} from '@compose/api-model'
import type {IEntity} from './Entities'
import type {ReferenceId, SerialCode} from './Utils'

export interface UserInfo extends IEntity {
  readonly fullName?: string
  readonly createUserId?: ReferenceId
  readonly userId?: ReferenceId
  pri?: boolean
  addressId?: ReferenceId
  addressCode?: SerialCode
  wechatAccount?: SerialCode
  qqAccount?: SerialCode
  qqOpenid?: SerialCode
  avatarImgId?: ReferenceId
  firstName?: string
  lastName?: string
  email?: string
  birthday?: LocalDate
  addressDetailsId?: ReferenceId
  phone?: SerialCode
  sparePhone?: SerialCode
  idCard?: SerialCode
  gender?: GenderTyping
  wechatOpenid?: SerialCode
  wechatAuthid?: SerialCode
}

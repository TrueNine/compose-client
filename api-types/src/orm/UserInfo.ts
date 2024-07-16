import type {GenderTyping} from '@compose/api-typings'

import type {IEntity} from './Entities'
import type {ReferenceId} from './Utils'

import type {LocalDate} from '@/datetime'
import type {SerialCode} from '@/typescripts'

export interface UserInfo extends IEntity {
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

import type {Timestamp} from '../datetime'

import {GenderTyping} from './typing'
import type {IEntity} from './Entities'
import type {Id, ReferenceId} from './Utils'

export interface UserInfo extends IEntity {
  userId: ReferenceId
  avatarImgId?: ReferenceId
  avatarImage?: string
  firstName: string
  lastName: string
  email?: string
  birthday?: Timestamp
  addressDetailsId?: Id
  phone?: string
  idCard?: string
  gender: GenderTyping
  wechatOpenId?: string
  wechatOauth2Id?: string
}

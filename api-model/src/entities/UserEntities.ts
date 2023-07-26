import {GenderTyping} from '@/enums'
import type {AddressDetails} from './Address'
import type {BaseEntity} from './BaiscEntities'

export {}

export interface User extends BaseEntity {
  account: string
  nickName: string
  doc?: string
  pwdEnc?: string
  lastLoginTime?: Date
  band: boolean
  banTime?: Date
}

export interface UserInfo extends BaseEntity {
  userId: number
  avatarImgId?: number
  avatarImage?: string
  firstName: string
  lastName: string
  email?: string
  birthday?: Date
  addressDetailsId?: number
  addressDetails?: AddressDetails
  phone?: string
  idCard?: string
  gender: GenderTyping
  wechatOpenId?: string
  wechatOauth2Id?: string
}

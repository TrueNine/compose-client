import {GenderTyping} from '../enums'
import {AddressDetauls} from './Address'

export interface BaseEntity {
  id?: string
}

export interface User extends BaseEntity {
  account: string
  nickName: string
  doc?: string
  pwdEnc?: string
  lastLoginTime?: Date
  band: boolean
  banTime?: Date
}

export interface RoleGroup extends BaseEntity {
  name: string
  doc?: string
  roles: Role[]
}

export interface Role {
  name: string
  doc?: string
  permissions: Permissions[]
}

export interface Permissions extends BaseEntity {
  name: string
  doc?: string
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
  addressDetails?: AddressDetauls
  phone?: string
  idCard?: string
  gender: GenderTyping
  wechatOpenId?: string
  wechatOauth2Id?: string
}

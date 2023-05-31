import {PointModel} from '../defineds'
import {GenderTyping} from '../enums'

export interface AnyEntity {
  id?: string
}

export interface UserEntityRequestParam {
  account: string
  nickName: string
  doc?: string
  pwdEnc?: string
}

export interface UserEntityResponseResult extends UserEntityRequestParam, AnyEntity {
  lastLoginTime?: Date
  info?: UserInfoEntityResponseResult
  band: boolean
  roleGroups: RoleGroupEntityResponseResult[]
  banTime?: Date
}

export interface RoleGroupEntityRequestParam {
  name: string
  doc?: string
}

export interface RoleGroupEntityResponseResult extends RoleGroupEntityRequestParam, AnyEntity {
  roles: RoleEntityResponseResult[]
}

export interface RoleEntityRequestParam {
  name: string
  doc?: string
}

export interface RoleEntityResponseResult extends RoleEntityRequestParam {
  permissions: PermissionsResponseResult[]
}

export interface PermissionsRequestParam {
  name: string
  doc?: string
}

export interface PermissionsResponseResult extends PermissionsRequestParam, AnyEntity {}

export interface UserInfoEntityRequestParam {
  userId: number
  avatarImgId?: number
  avatarImage?: string
  firstName: string
  lastName: string
  email?: string
  birthday?: Date
  addressDetailsId?: number
  addressDetails?: AddressDetailsEntityRequestParam
  phone?: string
  idCard?: string
  gender: GenderTyping
  wechatOpenId?: string
  wechatOauth2Id?: string
}

export interface UserInfoEntityResponseResult extends UserInfoEntityRequestParam, AnyEntity {
  user: UserEntityResponseResult
  avatarImage?: string
  fullName: string
  addressDetails?: AddressDetailsEntityResponseResult
}

export interface AddressDetailsEntityRequestParam {
  addressId: number
  addressDetails: string
  center?: PointModel
}

export interface AddressDetailsEntityResponseResult extends AddressDetailsEntityRequestParam, AnyEntity {
  address: AddressEntityResponseResult
}

export interface AddressEntityRequestParam {
  code?: string
  name: string
}

export interface AddressEntityResponseResult extends AddressEntityRequestParam, AnyEntity {
  level?: number
  details?: AddressDetailsEntityResponseResult[]
}

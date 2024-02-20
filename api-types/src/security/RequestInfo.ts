export interface RequestInfo {
  userId?: string
  account?: string
  deviceId?: string
  loginIpAddr?: string
  currentIpAddr?: string
}
export interface AuthRequestInfo extends RequestInfo {
  encryptedPassword?: string
  nonLocked?: boolean
  nonExpired?: boolean
  enabled?: boolean
  roles?: string[]
  permissions?: string[]
  depts?: string[]
}

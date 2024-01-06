import type {BigText, TypeInt} from '../../../orm'
import type {Timestamp} from '../../../datetime'

export interface BaseWxpaResp {
  errorCode?: TypeInt
  errorMessage?: string
  expireInSecond?: Timestamp
  isError?: boolean
}

export interface WxpaVerifyModel {
  signature?: BigText
  timestamp?: Timestamp
  nonce?: string
  echostr?: string
}

export interface WxpaGetAccessTokenResp extends BaseWxpaResp {
  accessToken?: string
}

export interface WxpaGetTicketResp extends BaseWxpaResp {
  ticket?: string
}

export interface WxpaSignatureResp {
  appId?: string
  nonceString?: string
  timestamp?: Timestamp
  url?: string
  sign?: string
}

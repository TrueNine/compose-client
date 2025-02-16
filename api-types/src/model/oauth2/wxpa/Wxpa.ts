import type {timestamp} from '@/datetime'
import type {bool, i32, str} from '@/typescripts'

export interface BaseWxpaResp {
  errorCode?: i32
  errorMessage?: str
  expireInSecond?: timestamp
  isError?: bool
}

export interface WxpaVerifyModel {
  signature?: str
  timestamp?: timestamp
  nonce?: str
  echostr?: str
}

export interface WxpaGetAccessTokenResp extends BaseWxpaResp {
  accessToken?: str
}

export interface WxpaGetTicketResp extends BaseWxpaResp {
  ticket?: str
}

export interface WxpaSignatureResp {
  appId?: str
  nonceString?: str
  timestamp?: timestamp
  url?: str
  sign?: str
}

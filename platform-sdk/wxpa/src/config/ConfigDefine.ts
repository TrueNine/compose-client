import type {SerialCode, Timestamp} from '@compose/api-types'

import type {JsApiListMap, OpenTagListMap} from '@/common'

export interface ConfigOptions {
  debug?: boolean
  appId: SerialCode
  timestamp: Timestamp
  nonceStr: SerialCode
  signature: SerialCode
  jsApiList?: (keyof JsApiListMap)[]
  openTagList?: (keyof OpenTagListMap)[]
}

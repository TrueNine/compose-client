import type {SerialCode, Timestamp} from '@compose/compose-types'

import type {JsApiListMap, OpenTagListMap} from '../common'

export interface ConfigOptions {
  debug?: boolean
  appId: SerialCode
  timestamp: Timestamp
  nonceStr: SerialCode
  signature: SerialCode
  jsApiList?: (keyof JsApiListMap)[]
  openTagList?: (keyof OpenTagListMap)[]
}

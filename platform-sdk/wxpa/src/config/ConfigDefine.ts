import type { JsApiListMap, OpenTagListMap } from '@/common'
import type { timestamp } from '@compose/api-types'

export interface ConfigOptions {
  debug?: boolean
  appId: string
  timestamp: timestamp
  nonceStr: string
  signature: string
  jsApiList?: (keyof JsApiListMap)[]
  openTagList?: (keyof OpenTagListMap)[]
}

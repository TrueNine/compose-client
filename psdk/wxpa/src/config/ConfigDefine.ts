import type { timestamp } from '@truenine/types'
import type { JsApiListMap, OpenTagListMap } from '@/common'

export interface ConfigOptions {
  debug?: boolean
  appId: string
  timestamp: timestamp
  nonceStr: string
  signature: string
  jsApiList?: (keyof JsApiListMap)[]
  openTagList?: (keyof OpenTagListMap)[]
}

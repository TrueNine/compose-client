import type { clip } from '@compose/types'
import type { ConfigOptions } from '@/config'

import { loadRemoteScriptTag } from '@compose/external/browser/document'
import { AllJsApiList } from '@/common/JsApiList'

export const WXPA_SCRIPT_URL = 'https://res.wx.qq.com/open/js/jweixin-1.6.0.js'

export function loadWxpaJsSdk(
  lazy?: () => void,
  configOptions?: clip<ConfigOptions, 'jsApiList'>,
): HTMLScriptElement {
  const script = loadRemoteScriptTag(WXPA_SCRIPT_URL, 'head', void 0, () => {
    if (configOptions) {
      wx.config({ ...configOptions, jsApiList: AllJsApiList })
    }
    wx.ready(() => {
      lazy?.()
    })
  }) as HTMLScriptElement

  return script
}

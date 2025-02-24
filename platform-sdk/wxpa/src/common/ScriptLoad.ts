import {loadRemoteScriptTag} from '@compose/extensions/browser/document'
import type {clip} from '@compose/api-types'

import type {ConfigOptions} from '@/config'
import {AllJsApiList} from '@/common/JsApiList'

export const WXPA_SCRIPT_URL = 'https://res.wx.qq.com/open/js/jweixin-1.6.0.js'

export function loadWxpaJsSdk(lazy?: () => void, configOptions?: clip<ConfigOptions, 'jsApiList'>) {
  return loadRemoteScriptTag(WXPA_SCRIPT_URL, 'head', void 0, () => {
    if (configOptions) wx.config({...configOptions, jsApiList: AllJsApiList})
    wx.ready(() => {
      lazy?.()
    })
  })
}

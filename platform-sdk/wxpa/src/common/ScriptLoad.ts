import {Dom} from '@compose/api-model'

export const WXPA_SCRIPT_URL = 'https://res.wx.qq.com/open/js/jweixin-1.6.0.js'

export function loadWxpaJsSdk(lazy?: () => void) {
  return Dom.loadRemoteScriptTag(WXPA_SCRIPT_URL, 'head', undefined, lazy)
}

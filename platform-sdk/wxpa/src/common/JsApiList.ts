export interface JsApiListMap {
  updateAppMessageShareData: never
  updateTimelineShareData: never
  /**
   * @deprecated 即将过期
   */
  onMenuShareTimeline: never
  /**
   * @deprecated 即将过期
   */
  onMenuShareAppMessage: never
  /**
   * @deprecated 即将过期
   */
  onMenuShareQQ: never
  onMenuShareWeibo: never
  onMenuShareQZone: never
  startRecord: never
  stopRecord: never
  onVoiceRecordEnd: never
  playVoice: never
  pauseVoice: never
  stopVoice: never
  onVoicePlayEnd: never
  uploadVoice: never
  downloadVoice: never
  chooseImage: never
  previewImage: never
  uploadImage: never
  downloadImage: never
  translateVoice: never
  getNetworkType: never
  openLocation: never
  getLocation: never
  hideOptionMenu: never
  showOptionMenu: never
  hideMenuItems: never
  showMenuItems: never
  hideAllNonBaseMenuItem: never
  showAllNonBaseMenuItem: never
  closeWindow: never
  scanQRCode: never
  openProductSpecificView: never
  addCard: never
  chooseCard: never
  openCard: never
}

export const AllJsApiList: (keyof JsApiListMap)[] = Array.from(
  new Set([
    'updateAppMessageShareData',

    'updateTimelineShareData',

    'onMenuShareTimeline',

    'onMenuShareAppMessage',

    'onMenuShareQQ',

    'onMenuShareWeibo',

    'onMenuShareQZone',

    'startRecord',

    'stopRecord',

    'onVoiceRecordEnd',

    'playVoice',

    'pauseVoice',

    'stopVoice',

    'onVoicePlayEnd',

    'uploadVoice',

    'downloadVoice',

    'chooseImage',

    'previewImage',

    'uploadImage',

    'downloadImage',

    'translateVoice',

    'getNetworkType',

    'openLocation',

    'getLocation',

    'hideOptionMenu',

    'showOptionMenu',

    'hideMenuItems',

    'showMenuItems',

    'hideAllNonBaseMenuItem',

    'showAllNonBaseMenuItem',

    'closeWindow',

    'scanQRCode',

    'openProductSpecificView',

    'addCard',

    'chooseCard',

    'openCard'
  ])
)

import type {dynamic} from '@truenine/types'

import type {CheckJsApiOption} from './basic'
import type {ConfigOptions} from './config'
import type {ChooseImageOption, PreviewImageOption} from './image'
import type {GetLocationOption} from './location'
import type {OnMenuShareTimelineOption, UpdateAppMessageShareDataOption, UpdateTimelineShareDataOption} from './share'

export * from './common'
export * from './config'
export * from './image'
export * from './location'
export * from './share'

declare global {
  /**
   * 在 js sdk 里面看到的，可能是 微信的 native 方法？目前作用未知
   */
  interface WeixinJSBridge {
    call: () => dynamic
    invoke: (e: dynamic, t: dynamic, n: dynamic) => dynamic
    on: (e: dynamic, t: dynamic) => dynamic
    log: (e: dynamic) => void
  }

  const WeixinJSBridge: WeixinJSBridge

  interface Wx {
    config: (o: ConfigOptions) => void
    ready: (c: () => void) => void
    error: (c: (res: dynamic) => void) => void

    /**
     * 检查当前对 js sdk 的支持情况
     */
    checkJsApi: (o: CheckJsApiOption) => void

    /**
     * 分享接口
     * @param shareData 分享参数
     */
    updateAppMessageShareData: (shareData: UpdateAppMessageShareDataOption) => void
    updateTimelineShareData: (shareData: UpdateTimelineShareDataOption) => void

    /**
     * @deprecated 1.6.0
     * @param o
     * @since 1.1.0
     */
    onMenuShareTimeline: (o: OnMenuShareTimelineOption) => void

    /**
     * @deprecated 即将过期
     * @param o
     */
    onMenuShareAppMessage: (o: OnMenuShareTimelineOption) => void

    /**
     * @deprecated 即将过期
     * @param o
     */
    onMenuShareQQ: (o: UpdateAppMessageShareDataOption) => void

    /**
     * @deprecated 即将过期
     * @param o
     */
    onMenuShareQZone: (o: UpdateAppMessageShareDataOption) => void

    chooseImage: (o: ChooseImageOption) => void
    previewImage: (o: PreviewImageOption) => void

    /**
     * ## 获取当前位置
     * @param o 参数
     */
    getLocation: (o: GetLocationOption) => void

    closeWindow: () => void
    hideAllNonBaseMenuItem: () => void
  }
}

declare global {
  let wx: Wx
}

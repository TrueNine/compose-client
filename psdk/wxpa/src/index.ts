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

    checkJsApi: (o: CheckJsApiOption) => void

    updateAppMessageShareData: (shareData: UpdateAppMessageShareDataOption) => void
    updateTimelineShareData: (shareData: UpdateTimelineShareDataOption) => void

    onMenuShareTimeline: (o: OnMenuShareTimelineOption) => void

    onMenuShareAppMessage: (o: OnMenuShareTimelineOption) => void

    onMenuShareQQ: (o: UpdateAppMessageShareDataOption) => void

    onMenuShareQZone: (o: UpdateAppMessageShareDataOption) => void

    chooseImage: (o: ChooseImageOption) => void
    previewImage: (o: PreviewImageOption) => void

    getLocation: (o: GetLocationOption) => void

    closeWindow: () => void
    hideAllNonBaseMenuItem: () => void
  }
}

declare global {
  let wx: Wx
}

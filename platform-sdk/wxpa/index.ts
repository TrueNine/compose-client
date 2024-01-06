import type {SafeAny} from '@compose/compose-types'

import type {ConfigOptions} from './config'
import type {UpdateAppMessageShareDataOption, UpdateTimelineShareDataOption} from './share'
import type {CheckJsApiOption} from './basic'
import type {GetLocationOption} from './location'
import type {ChooseImageOption, PreviewImageOption} from './image'

export * from './config'
export * from './common'
export * from './share'
export * from './image'
export * from './location'

declare global {
  export namespace wx {
    export function config(o: ConfigOptions): void

    export function ready(c: () => void): void

    export function error(c: (res: SafeAny) => void): void

    // -----------

    /**
     * 检查当前对 js sdk 的支持情况
     */
    export function checkJsApi(o: CheckJsApiOption): void

    /**
     * 分享接口
     * @param shareData 分享参数
     */
    export function updateAppMessageShareData(shareData: UpdateAppMessageShareDataOption): void

    export function updateTimelineShareData(shareData: UpdateTimelineShareDataOption): void

    /**
     * @deprecated 即将过期
     * @param o
     */
    export function onMenuShareTimeline(o: UpdateTimelineShareDataOption): void

    /**
     * @deprecated 即将过期
     * @param o
     */
    export function onMenuShareAppMessage(o: UpdateAppMessageShareDataOption): void

    /**
     * @deprecated 即将过期
     * @param o
     */
    export function onMenuShareQQ(o: UpdateAppMessageShareDataOption): void

    /**
     * @deprecated 即将过期
     * @param o
     */
    export function onMenuShareQZone(o: UpdateAppMessageShareDataOption): void
    export function chooseImage(o: ChooseImageOption): void
    export function previewImage(o: PreviewImageOption): void

    /**
     * ## 获取当前位置
     * @param o 参数
     */
    export function getLocation(o: GetLocationOption): void

    export function closeWindow(): void

    export function hideAllNonBaseMenuItem(): void
  }
}

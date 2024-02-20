import type {BigText, HttpUrl} from '@compose/api-types'

import type {BaseOption} from '../common'

export interface UpdateAppMessageShareDataOption extends BaseOption {
  /**
   * 分享标题
   */
  title: BigText
  /**
   * 分享描述
   */
  desc?: BigText
  /**
   * 分享链接，必须与当前页面链接保持一致
   * @default location.href
   */
  link: HttpUrl
  /**
   * 分享图标 图片链接
   */
  imgUrl?: HttpUrl
}

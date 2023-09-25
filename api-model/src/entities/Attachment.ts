import type {BaseEntity} from '@compose/compose-types'

import {AttachmentTyping} from '../enums'

/**
 * ## 可查询的轻量文件列表
 */
export interface LinkedAttachment extends BaseEntity {
  readonly id: string
  readonly url: string
  readonly metaName: string
}

/**
 * ## 附件
 */
export interface Attachment extends BaseEntity {
  metaName?: string
  saveName?: string
  urlName?: string
  urlDoc?: string
  attType: AttachmentTyping
  size?: number
  mimeType?: string
  urlId?: string
  baseUrl?: string
}

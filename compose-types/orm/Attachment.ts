import type {IEntity} from './Entities'
import {AttachmentTyping} from './typing'
import type {BigSerial, Id, ReferenceId} from './Utils'

/**
 * ## 附件
 */
export interface Attachment extends IEntity {
  metaName?: string
  saveName?: string
  urlName?: string
  urlDoc?: string
  attType: AttachmentTyping
  size?: BigSerial
  mimeType?: string
  urlId?: ReferenceId
  baseUrl?: string
}

/**
 * ## 可查询的轻量文件列表
 */
export interface LinkedAttachment extends IEntity {
  readonly id: Id
  readonly url: string
  readonly metaName: string
}
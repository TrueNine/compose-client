import type {IEntity} from '../Entities'
import type {BigText, ReferenceId, SerialCode} from '../Utils'
import type {LocalDateTime} from '../../datetime'
import {AuditTyping, DocumentContentTyping, DocumentPointTyping, DocumentTyping} from '../typing'

export interface UserDocument extends IEntity {
  wmAttId?: ReferenceId
  wmCode?: SerialCode
  attId?: ReferenceId
  createUserId?: ReferenceId
  createDeviceId?: ReferenceId
  createIp?: SerialCode
  createDatetime?: LocalDateTime
  remark?: BigText
  doc?: BigText
  name?: string
  userId?: ReferenceId
  poType?: DocumentPointTyping
  coType?: DocumentContentTyping
  doType?: DocumentTyping
  auditStatus?: AuditTyping
}

import type {IEntity} from '../Entities'
import type {BigText, ReferenceId, SerialCode} from '../Utils'
import type {LocalDateTime} from '../../datetime'
import {AuditTyping, DocumentContentTyping, DocumentPointTyping, DocumentTyping} from '../typing'

export interface MuDocument extends IEntity {
  wmAttId?: ReferenceId
  attId?: ReferenceId
  createUserId?: ReferenceId
  createDeviceId?: ReferenceId
  createIp?: SerialCode
  createDatetime?: LocalDateTime
  remark?: BigText
  doc?: BigText
  name?: string
  markUserId?: ReferenceId
  userId?: ReferenceId
  pType?: DocumentPointTyping
  cType?: DocumentContentTyping
  dType?: DocumentTyping
  auditStatus?: AuditTyping
}

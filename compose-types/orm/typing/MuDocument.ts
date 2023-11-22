import type {IEntity} from '../Entities'
import type {BigText, ReferenceId, SerialCode} from '../Utils'
import type {LocalDateTime} from '../../datetime'

import type {AuditTyping} from './AuditTyping'
import {DocumentContentTyping, DocumentPointTyping, DocumentTyping} from './documents'

export interface MuDocument extends IEntity {
  attId?: ReferenceId
  createUserId?: ReferenceId
  createDeviceId?: SerialCode
  createIp?: SerialCode
  createDatetime?: LocalDateTime
  remark?: BigText
  auditStatus?: AuditTyping
  doc?: BigText
  name?: string
  markUserId?: ReferenceId
  userId?: ReferenceId
  pType?: DocumentPointTyping
  cType?: DocumentContentTyping
  dType?: DocumentTyping
}

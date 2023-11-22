import type {LocalDateTime} from '../datetime'

import type {IEntity} from './Entities'
import type {BigText, ReferenceId, SerialCode, TypeInt} from './Utils'
import {AuditTyping} from './typing'

export interface Audit extends IEntity {
  auditDeviceId?: SerialCode
  auditIp?: string
  refType?: TypeInt
  refId?: ReferenceId
  remark?: BigText
  createDatetime?: LocalDateTime
  state?: AuditTyping
}
export interface AuditAttachment extends IEntity {
  status?: AuditTyping
  auditId?: ReferenceId
  attId?: ReferenceId
}

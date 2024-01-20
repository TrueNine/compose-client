import type {IEntity} from '../Entities'
import type {BigText, ReferenceId, RefId, SerialCode} from '../Utils'
import type {LocalDateTime} from '../../datetime'
import type {AuditTyping, CertContentTyping, CertPointTyping, CertTyping} from '@compose/api-model'

export interface Cert extends IEntity {
  userId?: ReferenceId
  userInfoId?: RefId
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
  poType?: CertPointTyping
  coType?: CertContentTyping
  doType?: CertTyping
  auditStatus?: AuditTyping
}

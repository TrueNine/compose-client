import type { datetime } from '@/datetime'

import type { IEntity, RefId } from '@/orm'
import type { AuditTyping, CertContentTyping, CertPointTyping, CertTyping } from '@compose/api-typings'

export interface Cert extends IEntity {
  userId?: RefId
  userInfoId?: RefId
  wmAttId?: RefId
  wmCode?: string
  attId?: RefId
  createUserId?: RefId
  createDeviceId?: RefId
  createIp?: string
  createDatetime?: datetime
  remark?: string
  doc?: string
  name?: string
  poType?: CertPointTyping
  coType?: CertContentTyping
  doType?: CertTyping
  auditStatus?: AuditTyping
}

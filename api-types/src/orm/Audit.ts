import type {AuditTyping} from '@compose/api-typings'

import type {IEntity} from './Entities'
import type {RefId} from './Utils'

import type {datetime} from '@/datetime'
import type {i32, str} from '@/typescripts'

export interface Audit extends IEntity {
  auditDeviceId?: str
  auditIp?: str
  refType?: i32
  refId?: RefId
  remark?: str
  createDatetime?: datetime
  state?: AuditTyping
}

export interface AuditAttachment extends IEntity {
  status?: AuditTyping
  auditId?: RefId
  attId?: RefId
}

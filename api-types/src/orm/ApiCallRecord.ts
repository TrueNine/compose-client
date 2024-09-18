import type {i32} from '@/typescripts'
import type {IEntity} from './Entities'
import type {datetime} from '@/datetime'

export interface ApiCallRecord extends IEntity {
  deviceCode?: string
  reqIp?: string
  loginIp?: string
  respCode?: i32
  respResultEnc?: string
  reqPath: string
  reqMethod: string
  reqProtocol?: string
  reqDatetime: datetime
  respDatetime: datetime
}

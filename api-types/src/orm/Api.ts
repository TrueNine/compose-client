import type {IEntity} from './Entities'
import type {RefId} from './Utils'

export interface Api extends IEntity {
  permissionsId?: RefId
  namme?: string
  doc?: string
  apiPath: string
  apiMethod: string
  apiProtocol?: string
}

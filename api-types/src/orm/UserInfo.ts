import type {GenderTyping} from '@compose/api-typings'

import type {IEntity} from './Entities'
import type {RefId} from './Utils'

import type {date} from '@/datetime'
import type {bool, str} from '@/typescripts'

export interface UserInfo extends IEntity {
  readonly createUserId?: RefId
  readonly userId?: RefId
  pri?: bool
  addressId?: RefId
  addressCode?: str
  wechatAccount?: str
  qqAccount?: str
  qqOpenid?: str
  avatarImgId?: RefId
  firstName?: str
  lastName?: str
  email?: str
  birthday?: date
  addressDetailsId?: RefId
  phone?: str
  sparePhone?: str
  idCard?: str
  gender?: GenderTyping
  wechatOpenid?: str
  wechatAuthid?: str
  /**
   * 用户备注
   */
  remark?: str
  /**
   * 用户备注名
   */
  remarkName?: str
}

import type {BigText, ReferenceId, SerialCode, TypeInt} from './Utils'
import {AuditTyping} from './typing'

export interface MarkUser {
  addressDetailsId?: ReferenceId
  addressCode?: SerialCode
  qqAccount?: string
  qqOpenid?: string
  wechatAccount?: SerialCode
  wechatOpenid?: SerialCode
  remark?: BigText
  email?: string
  idcard?: SerialCode
  sparePhone?: SerialCode
  phone?: SerialCode
  actualName?: string
  account?: SerialCode
  userId?: ReferenceId
  auditStatus?: AuditTyping
  userMarkType?: TypeInt
}

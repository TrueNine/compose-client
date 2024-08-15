import type {EnumCommentMap} from '@/types'
import {enumToOutput} from '@/enums'

export enum RelationItemTyping {
  NONE = 0,
  USER = 1,
  CUSTOMER = 2,
  ENTERPRISE = 3,
  EMPLOYEE = 4,
  OTHER = 9999
}
const co: EnumCommentMap<typeof RelationItemTyping> = {
  [RelationItemTyping.NONE]: '无',
  [RelationItemTyping.USER]: '用户',
  [RelationItemTyping.CUSTOMER]: '客户',
  [RelationItemTyping.ENTERPRISE]: '企业',
  [RelationItemTyping.EMPLOYEE]: '员工',
  [RelationItemTyping.OTHER]: '其他'
}
const e = enumToOutput(RelationItemTyping, co)
const a = e.comment
const b = e.map
const c = e.reverseMap
export {a as RelationItemTypingComment, b as RelationItemTypingMap, c as RelationItemTypingReverseMap}

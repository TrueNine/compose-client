import {enumToOutput} from '@compose/api-model'

import type {Evr} from '../../../enum'

export enum RelationItemTyping {
  NONE = 0,
  USER = 1,
  CUSTOMER = 2,
  ENTERPRISE = 3,
  EMPLOYEE = 4,
  OTHER = 9999
}
const co: Record<Evr<typeof RelationItemTyping>, string> = {
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

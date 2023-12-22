import type {Evr} from '../index'

export enum RelationItemTyping {
  NONE = 0,
  USER = 1,
  CUSTOMER = 2,
  ENTERPRISE = 3,
  EMPLOYEE = 4,
  OTHER = 9999
}
export const RelationItemTypingComment: Record<Evr<typeof RelationItemTyping>, string> = {
  [RelationItemTyping.NONE]: '无',
  [RelationItemTyping.USER]: '用户',
  [RelationItemTyping.CUSTOMER]: '客户',
  [RelationItemTyping.ENTERPRISE]: '企业',
  [RelationItemTyping.EMPLOYEE]: '员工',
  [RelationItemTyping.OTHER]: '其他'
}
export const RelationItemTypingMap: Record<Evr<typeof RelationItemTyping>, number> = {
  [RelationItemTyping.NONE]: 0,
  [RelationItemTyping.USER]: 1,
  [RelationItemTyping.CUSTOMER]: 2,
  [RelationItemTyping.ENTERPRISE]: 3,
  [RelationItemTyping.EMPLOYEE]: 4,
  [RelationItemTyping.OTHER]: 9999
}

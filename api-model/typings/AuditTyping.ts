import type {EnumCommentMap, EnumMap} from '@compose/api-types'

export enum AuditTyping {
  NONE = 0,
  ASSIGNED = 1,
  PASS = 2,
  FAIL = 3,
  CANCEL = 4,
  EXPIRED = 5,
  REJECT = 6
}

export const AuditTypingComment: EnumCommentMap<typeof AuditTyping> = {
  [AuditTyping.NONE]: '未审核',
  [AuditTyping.ASSIGNED]: '已分配',
  [AuditTyping.PASS]: '通过',
  [AuditTyping.FAIL]: '不通过',
  [AuditTyping.CANCEL]: '取消',
  [AuditTyping.EXPIRED]: '已过期',
  [AuditTyping.REJECT]: '已驳回'
}

export const AuditTypingReverseMap: EnumMap<typeof AuditTyping> = {
  [0]: AuditTyping.NONE,
  [1]: AuditTyping.ASSIGNED,
  [2]: AuditTyping.PASS,
  [3]: AuditTyping.FAIL,
  [4]: AuditTyping.CANCEL,
  [5]: AuditTyping.EXPIRED,
  [6]: AuditTyping.REJECT
}

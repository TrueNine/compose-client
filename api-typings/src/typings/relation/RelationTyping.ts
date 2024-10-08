import type {EnumCommentMap, EnumMap} from '@/types'

export enum RelationTyping {
  NONE = 0,
  BENEFICIARIES = 1,
  PARTICIPATOR = 2,
  WITNESS = 3,
  OTHER = 9999
}

export const RelationTypingComment: EnumCommentMap<typeof RelationTyping> = {
  [RelationTyping.NONE]: '无',
  [RelationTyping.BENEFICIARIES]: '受害者',
  [RelationTyping.PARTICIPATOR]: '帮凶',
  [RelationTyping.WITNESS]: '证人',
  [RelationTyping.OTHER]: '其他'
}

export const RelationTypingMap: EnumMap<typeof RelationTyping> = {
  [RelationTyping.NONE]: 0,
  [RelationTyping.BENEFICIARIES]: 1,
  [RelationTyping.PARTICIPATOR]: 2,
  [RelationTyping.WITNESS]: 3,
  [RelationTyping.OTHER]: 9999
}

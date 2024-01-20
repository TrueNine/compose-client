import type {EnumCommentMap, EnumMap} from '@compose/api-types'

export enum DegreeTyping {
  NONE = 0,
  MIN = 1,
  HALF = 2,
  HEIGHT = 3,
  BIG = 4,
  DISCOVERY = 5,
  EXPERT = 6,
  AFTER_EXPERT = 7,
  OTHER = 9999
}

export const DegreeTypingComment: EnumCommentMap<typeof DegreeTyping> = {
  [DegreeTyping.NONE]: '文盲',
  [DegreeTyping.MIN]: '小学',
  [DegreeTyping.HALF]: '初中',
  [DegreeTyping.HEIGHT]: '高中',
  [DegreeTyping.BIG]: '大学',
  [DegreeTyping.DISCOVERY]: '研究生',
  [DegreeTyping.EXPERT]: '博士',
  [DegreeTyping.AFTER_EXPERT]: '博士后',
  [DegreeTyping.OTHER]: '其他'
}

export const DegreeTypingMap: EnumMap<typeof DegreeTyping> = {
  [DegreeTyping.NONE]: 0,
  [DegreeTyping.MIN]: 1,
  [DegreeTyping.HALF]: 2,
  [DegreeTyping.HEIGHT]: 3,
  [DegreeTyping.BIG]: 4,
  [DegreeTyping.DISCOVERY]: 5,
  [DegreeTyping.EXPERT]: 6,
  [DegreeTyping.AFTER_EXPERT]: 7,
  [DegreeTyping.OTHER]: 9999
}

export const DegreeTypingReverseMap: EnumMap<typeof DegreeTyping> = {
  [0]: DegreeTyping.NONE,
  [1]: DegreeTyping.MIN,
  [2]: DegreeTyping.HALF,
  [3]: DegreeTyping.HEIGHT,
  [4]: DegreeTyping.BIG,
  [5]: DegreeTyping.DISCOVERY,
  [6]: DegreeTyping.EXPERT,
  [7]: DegreeTyping.AFTER_EXPERT,
  [9999]: DegreeTyping.OTHER
}

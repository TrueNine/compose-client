import type {EnumCommentMap, EnumMap} from '@/types'

/**
 * ## 残疾类别枚举
 */
export enum DisTyping {
  EYE = 1,
  EAR = 2,
  MOUTH = 3,
  BODY = 4,
  IQ = 5,
  NERVE = 6,
  MULTIPLE = 7
}

export const DisTypingComment: EnumCommentMap<typeof DisTyping> = {
  [DisTyping.EYE]: '视力',
  [DisTyping.EAR]: '听力',
  [DisTyping.MOUTH]: '言语',
  [DisTyping.BODY]: '肢体',
  [DisTyping.IQ]: '智力',
  [DisTyping.NERVE]: '精神',
  [DisTyping.MULTIPLE]: '多重'
}
export const DisTypingMap: EnumMap<typeof DisTyping> = {
  [DisTyping.EYE]: 1,
  [DisTyping.EAR]: 2,
  [DisTyping.MOUTH]: 3,
  [DisTyping.BODY]: 4,
  [DisTyping.IQ]: 5,
  [DisTyping.NERVE]: 6,
  [DisTyping.MULTIPLE]: 7
}

export const DisTypingReverseMap: EnumMap<typeof DisTyping> = {
  [1]: DisTyping.EYE,
  [2]: DisTyping.EAR,
  [3]: DisTyping.MOUTH,
  [4]: DisTyping.BODY,
  [5]: DisTyping.IQ,
  [6]: DisTyping.NERVE,
  [7]: DisTyping.MULTIPLE
}

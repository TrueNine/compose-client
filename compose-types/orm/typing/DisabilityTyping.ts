/**
 * ## 残疾类别枚举
 */
export enum DisabilityTyping {
  EYE = 1,
  EAR = 2,
  MOUTH = 3,
  BODY = 4,
  IQ = 5,
  NERVE = 6,
  MULTIPLE = 7
}

export const DisabilityTypingComment = {
  [DisabilityTyping.EYE]: '视力',
  [DisabilityTyping.EAR]: '听力',
  [DisabilityTyping.MOUTH]: '言语',
  [DisabilityTyping.BODY]: '肢体',
  [DisabilityTyping.IQ]: '智力',
  [DisabilityTyping.NERVE]: '精神',
  [DisabilityTyping.MULTIPLE]: '多重'
}
export const DisabilityTypingMap = {
  [DisabilityTyping.EYE]: 1,
  [DisabilityTyping.EAR]: 2,
  [DisabilityTyping.MOUTH]: 3,
  [DisabilityTyping.BODY]: 4,
  [DisabilityTyping.IQ]: 5,
  [DisabilityTyping.NERVE]: 6,
  [DisabilityTyping.MULTIPLE]: 7
}

export const DisabilityTypingReverseMap = {
  [1]: DisabilityTyping.EYE,
  [2]: DisabilityTyping.EAR,
  [3]: DisabilityTyping.MOUTH,
  [4]: DisabilityTyping.BODY,
  [5]: DisabilityTyping.IQ,
  [6]: DisabilityTyping.NERVE,
  [7]: DisabilityTyping.MULTIPLE
}

export enum DocumentPointTyping {
  NONE = 0,
  HEADS = 1,
  TAILS = 2,
  DOUBLE = 3,
  ALL = 4
}

export const DocumentPointTypingComment = {
  [DocumentPointTyping.NONE]: '无要求',
  [DocumentPointTyping.HEADS]: '正面',
  [DocumentPointTyping.TAILS]: '反面',
  [DocumentPointTyping.DOUBLE]: '双面',
  [DocumentPointTyping.ALL]: '所有'
}
export const DocumentPointTypingMap = {
  [DocumentPointTyping.NONE]: 0,
  [DocumentPointTyping.HEADS]: 1,
  [DocumentPointTyping.TAILS]: 2,
  [DocumentPointTyping.DOUBLE]: 3,
  [DocumentPointTyping.ALL]: 4
}
export const DocumentPointTypingReverseMap = {
  0: DocumentPointTyping.NONE,
  1: DocumentPointTyping.HEADS,
  2: DocumentPointTyping.TAILS,
  3: DocumentPointTyping.DOUBLE,
  4: DocumentPointTyping.ALL
}

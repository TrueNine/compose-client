export enum RelationTyping {
  NONE = 0,
  VICTION = 1,
  PARTICIPATOR = 2,
  WITNESS = 3,
  OTHER = 9999
}

export const RelationTypingComment = {
  [RelationTyping.NONE]: '无',
  [RelationTyping.VICTION]: '受害者',
  [RelationTyping.PARTICIPATOR]: '帮凶',
  [RelationTyping.WITNESS]: '证人',
  [RelationTyping.OTHER]: '其他'
}
export const RelationTypingMap = {
  [RelationTyping.NONE]: 0,
  [RelationTyping.VICTION]: 1,
  [RelationTyping.PARTICIPATOR]: 2,
  [RelationTyping.WITNESS]: 3,
  [RelationTyping.OTHER]: 9999
}

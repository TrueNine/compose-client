export enum DocumentTyping {
  NONE = 0,
  ID_CARD = 1,
  IC_CARD2 = 2,
  DISABILITY_CARD = 3,
  DISABILITY_CARD2 = 4,
  DISABILITY_CARD3 = 5,
  HOUSEHOLD_CARD = 6,
  BANK_CARD = 7,
  CONTRACT = 8,
  BIZ_LICENSE = 9
}

export const DocumentTypingComment = {
  [DocumentTyping.NONE]: '无要求',
  [DocumentTyping.ID_CARD]: '身份证',
  [DocumentTyping.IC_CARD2]: '二代身份证',
  [DocumentTyping.DISABILITY_CARD]: '残疾证',
  [DocumentTyping.DISABILITY_CARD2]: '残疾证2代',
  [DocumentTyping.DISABILITY_CARD3]: '残疾证3代',
  [DocumentTyping.HOUSEHOLD_CARD]: ' 户口',
  [DocumentTyping.BANK_CARD]: '银行卡',
  [DocumentTyping.CONTRACT]: '合同',
  [DocumentTyping.BIZ_LICENSE]: '营业执照'
}
export const DocumentTypingMap = {
  [DocumentTyping.NONE]: 0,
  [DocumentTyping.ID_CARD]: 1,
  [DocumentTyping.IC_CARD2]: 2,
  [DocumentTyping.DISABILITY_CARD]: 3,
  [DocumentTyping.DISABILITY_CARD2]: 4,
  [DocumentTyping.DISABILITY_CARD3]: 5,
  [DocumentTyping.HOUSEHOLD_CARD]: 6,
  [DocumentTyping.BANK_CARD]: 7,
  [DocumentTyping.CONTRACT]: 8,
  [DocumentTyping.BIZ_LICENSE]: 9
}
export const DocumentTypingReverseMap = {
  [0]: DocumentTyping.NONE,
  [1]: DocumentTyping.ID_CARD,
  [2]: DocumentTyping.IC_CARD2,
  [3]: DocumentTyping.DISABILITY_CARD,
  [4]: DocumentTyping.DISABILITY_CARD2,
  [5]: DocumentTyping.DISABILITY_CARD3,
  [6]: DocumentTyping.HOUSEHOLD_CARD,
  [7]: DocumentTyping.BANK_CARD,
  [8]: DocumentTyping.CONTRACT,
  [9]: DocumentTyping.BIZ_LICENSE
}

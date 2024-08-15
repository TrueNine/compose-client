import type {EnumCommentMap, EnumMap} from '@/types'

export enum CertTyping {
  NONE = 0,
  ID_CARD = 1,
  ID_CARD2 = 2,
  DISABILITY_CARD = 3,
  DISABILITY_CARD2 = 4,
  DISABILITY_CARD3 = 5,
  HOUSEHOLD_CARD = 6,
  BANK_CARD = 7,
  CONTRACT = 8,
  BIZ_LICENSE = 9,
  TITLE_IMAGE = 10,
  PERSONAL_INCOME_TAX_VIDEO = 11
}

export const CertTypingComment: EnumCommentMap<typeof CertTyping> = {
  [CertTyping.NONE]: '无',
  [CertTyping.ID_CARD]: '身份证',
  [CertTyping.ID_CARD2]: '二代身份证',
  [CertTyping.DISABILITY_CARD]: '残疾证',
  [CertTyping.DISABILITY_CARD2]: '二代残疾证',
  [CertTyping.DISABILITY_CARD3]: '三代残疾证',
  [CertTyping.HOUSEHOLD_CARD]: ' 户口',
  [CertTyping.BANK_CARD]: '银行卡',
  [CertTyping.CONTRACT]: '合同',
  [CertTyping.BIZ_LICENSE]: '营业执照',
  [CertTyping.TITLE_IMAGE]: '寸照',
  [CertTyping.PERSONAL_INCOME_TAX_VIDEO]: '个人所得税视频'
}
export const CertTypingMap: EnumMap<typeof CertTyping> = {
  [CertTyping.NONE]: 0,
  [CertTyping.ID_CARD]: 1,
  [CertTyping.ID_CARD2]: 2,
  [CertTyping.DISABILITY_CARD]: 3,
  [CertTyping.DISABILITY_CARD2]: 4,
  [CertTyping.DISABILITY_CARD3]: 5,
  [CertTyping.HOUSEHOLD_CARD]: 6,
  [CertTyping.BANK_CARD]: 7,
  [CertTyping.CONTRACT]: 8,
  [CertTyping.BIZ_LICENSE]: 9,
  [CertTyping.TITLE_IMAGE]: 10,
  [CertTyping.PERSONAL_INCOME_TAX_VIDEO]: 11
}

export const CertTypingReverseMap: EnumMap<typeof CertTyping> = {
  [0]: CertTyping.NONE,
  [1]: CertTyping.ID_CARD,
  [2]: CertTyping.ID_CARD2,
  [3]: CertTyping.DISABILITY_CARD,
  [4]: CertTyping.DISABILITY_CARD2,
  [5]: CertTyping.DISABILITY_CARD3,
  [6]: CertTyping.HOUSEHOLD_CARD,
  [7]: CertTyping.BANK_CARD,
  [8]: CertTyping.CONTRACT,
  [9]: CertTyping.BIZ_LICENSE,
  [10]: CertTyping.TITLE_IMAGE,
  [11]: CertTyping.PERSONAL_INCOME_TAX_VIDEO
}

import type {TypeInt} from '../../Utils'
import type {Evr} from '../../../enum'

export enum CertTyping {
  NONE = 0,
  ID_CARD = 1,
  IC_CARD2 = 2,
  DISABILITY_CARD = 3,
  DISABILITY_CARD2 = 4,
  DISABILITY_CARD3 = 5,
  HOUSEHOLD_CARD = 6,
  BANK_CARD = 7,
  CONTRACT = 8,
  BIZ_LICENSE = 9,
  TITLE_IMAGE = 10
}

export const CertTypingComment: Record<Evr<typeof CertTyping>, string> = {
  [CertTyping.NONE]: '无要求',
  [CertTyping.ID_CARD]: '身份证',
  [CertTyping.IC_CARD2]: '二代身份证',
  [CertTyping.DISABILITY_CARD]: '残疾证',
  [CertTyping.DISABILITY_CARD2]: '残疾证2代',
  [CertTyping.DISABILITY_CARD3]: '残疾证3代',
  [CertTyping.HOUSEHOLD_CARD]: ' 户口',
  [CertTyping.BANK_CARD]: '银行卡',
  [CertTyping.CONTRACT]: '合同',
  [CertTyping.BIZ_LICENSE]: '营业执照',
  [CertTyping.TITLE_IMAGE]: '寸照'
}
export const CertTypingMap: Record<Evr<typeof CertTyping>, TypeInt> = {
  [CertTyping.NONE]: 0,
  [CertTyping.ID_CARD]: 1,
  [CertTyping.IC_CARD2]: 2,
  [CertTyping.DISABILITY_CARD]: 3,
  [CertTyping.DISABILITY_CARD2]: 4,
  [CertTyping.DISABILITY_CARD3]: 5,
  [CertTyping.HOUSEHOLD_CARD]: 6,
  [CertTyping.BANK_CARD]: 7,
  [CertTyping.CONTRACT]: 8,
  [CertTyping.BIZ_LICENSE]: 9,
  [CertTyping.TITLE_IMAGE]: 10
}
export const CertTypingReverseMap: Record<Evr<typeof CertTyping>, CertTyping> = {
  [0]: CertTyping.NONE,
  [1]: CertTyping.ID_CARD,
  [2]: CertTyping.IC_CARD2,
  [3]: CertTyping.DISABILITY_CARD,
  [4]: CertTyping.DISABILITY_CARD2,
  [5]: CertTyping.DISABILITY_CARD3,
  [6]: CertTyping.HOUSEHOLD_CARD,
  [7]: CertTyping.BANK_CARD,
  [8]: CertTyping.CONTRACT,
  [9]: CertTyping.BIZ_LICENSE,
  [10]: CertTyping.TITLE_IMAGE
}

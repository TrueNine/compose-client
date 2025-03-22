import type { timestamp } from '@compose/api-types'
import { Regexes } from '@/consts/Regexes'

import { GenderTyping } from '@compose/api-typings'

export const IdcardUtils = {
  getInfo(idcard: string) {
    const trimIdcard = idcard.trim().substring(0, 18)
    const year = Number(trimIdcard.substring(6, 10))
    const month = Number(trimIdcard.substring(10, 12))
    const day = Number(trimIdcard.substring(12, 14))
    const d = new Date(year, month - 1, day)
    if (d.getTime() >= Date.now())
      return void 0

    const birthday = d.getTime()

    if (Regexes.CHINA_ID_CARD.test(trimIdcard)) {
      return {
        adCode: trimIdcard.substring(0, 6),
        gender: Number(trimIdcard.substring(16, 17)) % 2 === 0 ? GenderTyping.WOMAN : GenderTyping.MAN,
        birthday: birthday satisfies timestamp,
      }
    }
    else {
      return void 0
    }
  },
}

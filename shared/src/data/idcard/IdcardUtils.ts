import type { timestamp } from '@truenine/types'
import { Regexes } from '@/consts/Regexes'

export const IdcardUtils = {
  getInfo(idcard: string): { adCode: string, gender: boolean, birthday: timestamp } | undefined {
    const trimIdcard = idcard.trim().slice(0, 18)
    const year = Number(trimIdcard.slice(6, 10))
    const month = Number(trimIdcard.slice(10, 12))
    const day = Number(trimIdcard.slice(12, 14))
    const d = new Date(year, month - 1, day)
    if (d.getTime() >= Date.now()) return void 0

    const birthday = d.getTime()

    return Regexes.CHINA_ID_CARD.test(trimIdcard)
      ? {
          adCode: trimIdcard.slice(0, 6),
          gender: Number(trimIdcard.slice(16, 17)) % 2 === 0,
          birthday: birthday satisfies timestamp,
        }
      : void 0
  },
}

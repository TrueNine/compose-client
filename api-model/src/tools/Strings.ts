import type { late } from '@compose/api-types'

import { __LOWERS_CHINESE_NUMBER_HEXS, __LOWVERS_CHINESE_NUMBERS, __UPPERS_CHINESE_NUMBER_HEXS, __UPPERS_CHINESE_NUMBERS } from '@/consts'

export function camelTo(str: string, sep = '-'): string {
  return str.replace(/([a-z0-9])([A-Z])/g, `$1${sep}$2`).toLowerCase()
}

export function numberToChinese(num?: number, upperCase = false): late<string> {
  const AA = upperCase ? __UPPERS_CHINESE_NUMBERS : __LOWVERS_CHINESE_NUMBERS
  const BB = upperCase ? __UPPERS_CHINESE_NUMBER_HEXS : __LOWERS_CHINESE_NUMBER_HEXS

  if (num == null)
    return void 0
  if (!/^\d*(?:\.\d*)?$/.test(num.toString()))
    return void 0

  const a: string[] = num.toString().replace(/(^0*)/g, '').split('.')
  let k = 0
  let re = ''

  for (let i = a[0].length - 1; i >= 0; i--) {
    switch (k) {
      case 0:
        re = BB[7] + re
        break
      case 4:
        if (!new RegExp(`0{4}\\d{${(a[0].length - i - 1).toString()}}$`).test(a[0]))
          re = BB[4] + re
        break
      case 8:
        re = BB[5] + re
        BB[7] = BB[5]
        k = 0
        break
    }
    if (k % 4 === 2 && a[0].charAt(i + 2) !== '0' && a[0].charAt(i + 1) === '0')
      re = AA[0] + re
    if (a[0].charAt(i) !== '0')
      re = AA[a[0].charAt(i) as unknown as number] + BB[k % 4] + re
    k++
  }

  if (a.length > 1) {
    re += BB[6]
    for (let i = 0; i < a[1].length; i++) re += AA[a[1].charAt(i) as unknown as number]
  }
  return re
}

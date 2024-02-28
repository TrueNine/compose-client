import type {ICnDistrict, int} from '@compose/api-types'

import {STR_EMPTY} from '@/consts'

interface AddrLevel {
  province?: string
  city?: string
  district?: string
  town?: string
  village?: string
}

export class CnDistrict implements ICnDistrict {
  static TWO_ZERO = '00'
  static ERROR_DIG = [0, 1, 3, 5, 7, 8, 10, 11]
  static GLOBAL_CODE = CnDistrict.TWO_ZERO
  static THREE_ZERO = '000'
  level: int
  leaf?: boolean = false
  code: string
  name = STR_EMPTY
  addrLevel: AddrLevel
  private readonly _formatError: boolean

  static ofCounty() {
    return new CnDistrict(CnDistrict.GLOBAL_CODE)
  }

  get serialArray(): string[] {
    if (this._formatError) return []
    return [this.addrLevel.province, this.addrLevel.city, this.addrLevel.district, this.addrLevel.town, this.addrLevel.village].filter(
      e => e !== CnDistrict.TWO_ZERO && e !== CnDistrict.THREE_ZERO && e !== STR_EMPTY
    ) as string[]
  }

  get pad() {
    if (this._formatError) return STR_EMPTY
    return this.code.padEnd(12, '0')
  }

  /**
   * 获取裁剪后的 code
   */
  get clipCode(): string {
    if (this._formatError) return STR_EMPTY
    const codeLengths = [2, 4, 6, 9]
    const length = codeLengths[this.level - 1] || 12
    return this.code.slice(0, length)
  }

  constructor(code: string) {
    this._formatError = false
    if (code == null || code.length > 12 || code.length < 2 || CnDistrict.ERROR_DIG.includes(code.length)) {
      this._formatError = true
      this.code = CnDistrict.GLOBAL_CODE
    }
    this.code = code.padEnd(12, '0')

    this.addrLevel = {
      province: this.code.slice(0, 2),
      city: this.code.slice(2, 4),
      district: this.code.slice(4, 6),
      town: this.code.slice(6, 9),
      village: this.code.slice(9, 12)
    }
    let l = 0
    if (this.addrLevel.province !== CnDistrict.TWO_ZERO) l += 1
    if (this.addrLevel.city !== CnDistrict.TWO_ZERO) l += 1
    if (this.addrLevel.district !== CnDistrict.TWO_ZERO) l += 1
    if (this.addrLevel.town !== CnDistrict.THREE_ZERO) l += 1
    if (this.addrLevel.village !== CnDistrict.THREE_ZERO) l += 1
    this.level = l
  }
}

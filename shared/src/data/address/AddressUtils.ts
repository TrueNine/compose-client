import type { AddrCode, ChinaDistrictLevel, i64, IChinaAddressDistrict } from '@truenine/types'

import { STR_EMPTY } from '@/consts'

type AddrLevel = Record<ChinaDistrictLevel, string>

export class AddressUtils implements IChinaAddressDistrict {
  static TWO_ZERO = '00' as const
  static ERROR_DIG = [0, 1, 3, 5, 7, 8, 10, 11] as const
  static GLOBAL_CODE: `${number}` = AddressUtils.TWO_ZERO
  static THREE_ZERO = '000' as const
  level: i64
  leaf?: boolean = false
  code: AddrCode
  name: string = STR_EMPTY
  addrLevel: AddrLevel
  private readonly _formatError: boolean

  static ofCounty(): AddressUtils {
    return new AddressUtils(AddressUtils.GLOBAL_CODE)
  }

  get serialArray(): string[] {
    if (this._formatError) {
      return []
    }
    return [this.addrLevel.province, this.addrLevel.city, this.addrLevel.district, this.addrLevel.town, this.addrLevel.village].filter(
      (e) => e !== AddressUtils.TWO_ZERO && e !== AddressUtils.THREE_ZERO && e !== STR_EMPTY,
    )
  }

  get pad(): string {
    if (this._formatError) {
      return STR_EMPTY
    }
    return this.code.padEnd(12, '0')
  }

  /**
   * 获取裁剪后的 code
   */
  get clipCode(): string {
    if (this._formatError) {
      return STR_EMPTY
    }
    const codeLengths = [2, 4, 6, 9]
    const length = codeLengths[this.level - 1] || 12
    return this.code.slice(0, length)
  }

  constructor(code: string) {
    this._formatError = false
    if (code.length > 12 || code.length < 2 || AddressUtils.ERROR_DIG.includes(code.length as 0 | 1 | 3 | 5 | 7 | 8 | 10 | 11)) {
      this._formatError = true
      this.code = AddressUtils.GLOBAL_CODE
    }
    this.code = code.padEnd(12, '0') as unknown as AddrCode

    this.addrLevel = {
      province: this.code.slice(0, 2),
      city: this.code.slice(2, 4),
      district: this.code.slice(4, 6),
      town: this.code.slice(6, 9),
      village: this.code.slice(9, 12),
    }
    let l = 0
    if (this.addrLevel.province !== AddressUtils.TWO_ZERO) {
      l += 1
    }
    if (this.addrLevel.city !== AddressUtils.TWO_ZERO) {
      l += 1
    }
    if (this.addrLevel.district !== AddressUtils.TWO_ZERO) {
      l += 1
    }
    if (this.addrLevel.town !== AddressUtils.THREE_ZERO) {
      l += 1
    }
    if (this.addrLevel.village !== AddressUtils.THREE_ZERO) {
      l += 1
    }
    this.level = l
  }
}

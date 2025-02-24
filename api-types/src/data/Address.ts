import type {i32} from '@/typescripts'

export type AddrCode = '00' | '000' | '' | `${number}`

export type ChinaDistrictLevel = 'province' | 'city' | 'district' | 'town' | 'village'

export interface IChinaAddressDistrict {
  code: AddrCode
  name: string

  /**
   * @default false
   */
  leaf?: boolean
  /**
   * @default 0
   */
  level: i32
}

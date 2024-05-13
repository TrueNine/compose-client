import type {bigserial} from '@/typescripts'

type AddrCode = '00' | '000' | '' | `${number}` | string

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
  level: bigserial
}

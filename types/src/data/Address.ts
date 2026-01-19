import type {i32} from '@/typescripts'

export type AddrCode = '00' | '000' | '' | `${number}`

export type ChinaDistrictLevel = 'province' | 'city' | 'district' | 'town' | 'village'

export interface IChinaAddressDistrict {
  code: AddrCode
  name: string

  leaf?: boolean
  level: i32
}

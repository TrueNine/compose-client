import type {BigSerial} from '../dist'

export {}

type AddrCode = '00' | string

export type ICnDistrictLevels = 'province' | 'city' | 'district' | 'town' | 'village'
export interface ICnDistrict {
  code: AddrCode
  name: string

  /**
   * @default false
   */
  leaf?: boolean
  /**
   * @default 0
   */
  level: BigSerial
}

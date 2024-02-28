import {Vue} from '@compose/api-model'
import type {Asyncable, BigSerial, Int, Late, LateNull, SerialCode} from '@compose/api-types'

import _c from './YVAddressSelect.vue'

export type ISelectLevel = 'province' | 'city' | 'district' | 'town' | 'village'

export interface IComponentAddr {
  code: string
  name: string
  leaf?: boolean
  level: BigSerial
}

export interface YVAddressSelectProps {
  level?: ISelectLevel
  selectedLevel?: Int
  adCode?: SerialCode
  fullPath?: string
  showAdCode?: boolean
  showFullPath?: boolean
  findProvinces?: () => Asyncable<LateNull<LateNull<IComponentAddr>[]>>
  findCities?: (addr: LateNull<IComponentAddr>) => Asyncable<LateNull<LateNull<IComponentAddr>[]>>
  findDistricts?: (addr: LateNull<IComponentAddr>) => Asyncable<LateNull<LateNull<IComponentAddr>[]>>
  findTowns?: (addr: LateNull<IComponentAddr>) => Asyncable<LateNull<LateNull<IComponentAddr>[]>>
  findVillages?: (addr: LateNull<IComponentAddr>) => Asyncable<LateNull<LateNull<IComponentAddr>[]>>
  findByCode?: (addr: LateNull<IComponentAddr>) => Asyncable<LateNull<LateNull<IComponentAddr>[]>>
}

export interface YAddressSelectEmits {
  (e: 'update:adCode', v: string): void
  (e: 'update:fullPath', v: string): void
  (e: 'update:selectedLevel', v: Int): void
}

export interface YVAddressSelectSelectValue {
  province?: Late<IComponentAddr>
  city?: Late<IComponentAddr>
  district?: Late<IComponentAddr>
  town?: Late<IComponentAddr>
  village?: Late<IComponentAddr>
}

export const YVAddressSelectDefaultSelects = {
  province: {
    name: '选择省份',
    code: '',
    leaf: false,
    level: 1
  },
  city: {
    name: '选择市',
    code: '',
    leaf: false,
    level: 2
  },
  district: {
    name: '选择区/县',
    code: '',
    leaf: false,
    level: 3
  },
  town: {
    name: '选择镇/街道',
    code: '',
    leaf: false,
    level: 4
  },
  village: {
    name: '选择村/居委会',
    code: '',
    leaf: false,
    level: 5
  }
}

export function getAdCodeLevel(code: string) {
  const padCode = code.padEnd(12, '0')
  const obj = {
    province: padCode.slice(0, 2),
    city: padCode.slice(2, 4),
    district: padCode.slice(4, 6),
    town: padCode.slice(6, 9),
    village: padCode.slice(9, 12)
  }
  let level = 0
  if (obj.province !== '00') level = 2
  if (obj.city !== '00') level = 3
  if (obj.district !== '00') level = 4
  if (obj.town !== '000') level = 5
  else if (obj.village !== '000') level = 5
  return level
}
export const clipCode = (code: string, level: Int) => {
  switch (level) {
    case 1:
      return code.slice(0, 2)
    case 2:
      return code.slice(0, 4)
    case 3:
      return code.slice(0, 6)
    case 4:
      return code.slice(0, 9)
    case 5:
      return code.slice(0, 12)
    default:
      return code
  }
}
const a = Vue.componentInstallToPlugin<typeof _c>(_c)
export default a
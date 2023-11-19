import {Vue} from '@compose/api-model'
import type {Asyncable, BigSerial, Int, Late, LateNull, SerialCode} from '@compose/compose-types'

import _c from './YVAddressSelect.vue'

export default Vue.componentInstallToPlugin(_c)

export type ISelectLevel = 'province' | 'city' | 'district' | 'town' | 'village'

export interface IComponentAddr {
  code: string
  name: string
  leaf?: boolean
  level: BigSerial
}

export interface Props {
  level?: ISelectLevel
  selectedLevel?: Int
  fullPath?: string
  adCode?: SerialCode
  showAdCode?: boolean
  showFullPath?: boolean
  findProvinces?: () => Asyncable<LateNull<LateNull<IComponentAddr>[]>>
  notFoundProvinces?: () => Asyncable<LateNull<LateNull<IComponentAddr>[]>>
  findCities?: (addr: LateNull<IComponentAddr>) => Asyncable<LateNull<LateNull<IComponentAddr>[]>>
  findDistricts?: (addr: LateNull<IComponentAddr>) => Asyncable<LateNull<LateNull<IComponentAddr>[]>>
  findTowns?: (addr: LateNull<IComponentAddr>) => Asyncable<LateNull<LateNull<IComponentAddr>[]>>
  findVillages?: (addr: LateNull<IComponentAddr>) => Asyncable<LateNull<LateNull<IComponentAddr>[]>>
}

export interface Emits {
  (e: 'update:adCode', v: string): void
  (e: 'update:fullPath', v: string): void
  (e: 'update:selectedLevel', v: Int): void
}

export interface SelectValue {
  province?: Late<IComponentAddr>
  city?: Late<IComponentAddr>
  district?: Late<IComponentAddr>
  town?: Late<IComponentAddr>
  village?: Late<IComponentAddr>
}

export const defaultSelects = {
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

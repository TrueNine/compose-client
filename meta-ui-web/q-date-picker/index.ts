import {Vue} from '@compose/api-model'
import type {Late, Timestamp} from '@compose/compose-types'
import type {QDateProps} from 'quasar'

import _c from './YQDatePicker.vue'

export default Vue.componentInstallToPlugin(_c)

export interface Props extends Omit<QDateProps, 'modelValue'> {
  value?: Timestamp
  rangeValue?: [Late<Timestamp>, Late<Timestamp>]
  rangeStartValue?: Timestamp
  rangeEndValue?: Timestamp
  range?: boolean
  landscape?: boolean
  mini?: boolean
  title?: string
  subtitle?: string
}

export interface Emits {
  (e: 'update:value', v: Timestamp): void
  (e: 'update:rangeStartValue', v: Timestamp): void
  (e: 'update:rangeEndValue', v: Timestamp): void
  (e: 'update:rangeValue', v: [Late<Timestamp>, Late<Timestamp>]): void
}

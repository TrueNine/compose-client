import {Vue} from '@compose/extensions/vue'
import type {dynamic, Maybe} from '@compose/api-types'
import type {Schema} from 'yup'

import _c from './YForm.vue'

import type {ModelValueEmits, ModelValueProps} from '@/common'

export interface YFormProps extends ModelValueProps<dynamic> {
  schema?: Maybe<Schema<dynamic, dynamic>>
  isValid?: boolean
  step?: number
  mixins?: object
  everyStep?: boolean
}

export interface YFormEmits extends ModelValueEmits<dynamic> {
  (e: 'update:isValid', v: boolean): void
  (e: 'update:mixins', v: dynamic): void
  (e: 'submit', values?: dynamic, step?: number): void
  (e: 'next', values?: dynamic, step?: number): void
  (e: 'reset', values?: dynamic, isValid?: boolean): void
  (e: 'update:step', v: number): void
  (e: 'error'): void
  (e: 'update:everyStep', v: boolean): void
}

const a = Vue.componentInstallToPlugin<typeof _c>(_c)
export default a

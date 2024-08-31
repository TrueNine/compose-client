import {Vue} from '@compose/extensions/vue'
import type {dynamic, Maybe, nil} from '@compose/api-types'
import type {ObjectSchema, Schema} from 'yup'
import type {FormContext} from 'vee-validate'
import type {InjectionKey} from 'vue'

import _c from './YForm.vue'

import type {ModelValueEmits, ModelValueProps} from '@/common'

export interface YFormProps extends ModelValueProps<dynamic> {
  schema?: Maybe<ObjectSchema<dynamic, dynamic>>
  isValid?: boolean
  step?: number
  mixins?: object
  sync?: dynamic
  everyStep?: boolean
}

export interface YFormEmits extends ModelValueEmits<dynamic> {
  (e: 'update:isValid', v: boolean): void
  (e: 'update:mixins', v: dynamic): void
  (e: 'update:sync', v: dynamic): void
  (e: 'submit', values?: dynamic, step?: number): void
  (e: 'next', values?: dynamic, step?: number): void
  (e: 'reset', values?: dynamic, isValid?: boolean): void
  (e: 'update:step', v: number): void
  (e: 'error'): void
  (e: 'update:everyStep', v: boolean): void
}
export interface YFormInjection {
  getForm: () => FormContext<dynamic, dynamic>
  getRef: () => nil<HTMLFormElement>
  validate: () => Promise<boolean>
  setFieldValidate: (key: string, schema: Schema<dynamic, dynamic>) => void
}

export const YFormInjectionKey: InjectionKey<YFormInjection> = Symbol('YForm-Injection-Provider')

const a = Vue.componentInstallToPlugin(_c)
export default a

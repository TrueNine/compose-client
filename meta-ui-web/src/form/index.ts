import {Vue} from '@compose/extensions/vue'
import type {dynamic, Maybe} from '@compose/api-types'
import type {ObjectSchema, Schema} from 'yup'
import type {FormContext} from 'vee-validate'
import type {InjectionKey} from 'vue'

import _c from './YForm.vue'

import type {ModelValueEmits, ModelValueProps} from '@/common'

export interface YFormProps extends ModelValueProps<dynamic> {
  /**
   * 表单验证规则
   */
  schema?: Maybe<ObjectSchema<dynamic, dynamic>>
  /**
   * 表单验证状态
   */
  isValid?: boolean
  /**
   * 表单步数
   * @default 0
   */
  step?: number

  /**
   * 是否每个步骤发出 next 事件
   */
  everyStep?: boolean
}

export interface YFormEmits extends ModelValueEmits<dynamic> {
  (e: 'update:isValid', v: boolean): void
  (e: 'submit', values?: dynamic, step?: number): void
  (e: 'next', values?: dynamic, step?: number): void
  (e: 'reset', values?: dynamic, isValid?: boolean): void
  (e: 'update:step', v: number): void
  (e: 'error'): void
  (e: 'update:everyStep', v: boolean): void
}

export interface YFormInjection {
  getForm: () => FormContext<dynamic, dynamic>
  validate: () => Promise<boolean>
  setFieldValidate: (key: string, schema: Schema<dynamic, dynamic>) => void
}

export const YFormInjectionKey: InjectionKey<YFormInjection> = Symbol('YForm-Injection-Provider')

const a = Vue.componentInstallToPlugin(_c)

export default a

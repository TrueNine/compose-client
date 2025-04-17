import type { ModelValueEmits, ModelValueProps } from '@/common'
import type { dynamic, Maybe } from '@compose/api-types'
import type { FormContext, InvalidSubmissionContext, TypedSchema } from 'vee-validate'
import type { InjectionKey, VNode, WritableComputedRef } from 'vue'

import type { Schema as YupSchema } from 'yup'

import type { ZodSchema } from 'zod'
import { componentInstallToPlugin } from '@/common'

import _c from './YForm.vue'

interface FormAttribute {
  method?: string
  target?: string
  action?: string
  autocomplete?: string
  acceptcharset?: string
  enctype?: string
  novalidate?: boolean | 'true' | 'false'
}
export type YFormPropsSchema = TypedSchema | YupSchema | ZodSchema
export interface YFormProps extends ModelValueProps<dynamic>, FormAttribute {

  /**
   * 表单名称
   */
  name?: string

  /**
   * 表单验证规则
   */
  schema?: Maybe<YFormPropsSchema>
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
  /**
   * 初始值
   */
  initValue?: dynamic
}

export interface YFormEmits extends ModelValueEmits<dynamic> {
  'update:isValid': [ v: boolean]
  'next': [values?: dynamic, step?: number]
  'submit': [values?: dynamic, step?: number]
  'reset': [values?: dynamic, isValid?: boolean]
  'update:everyStep': [values?: dynamic, isValid?: boolean]
  'update:step': [v: number]
  'error': [ctx: InvalidSubmissionContext]
}
export interface YFormSlotsSubMitProps {
  disabled: boolean
  isSubmitting: boolean
  submit: (ev?: Event) => void
  reset: () => void
}
export interface YFormSlots {
  default: (props: dynamic) => VNode[]
  submit: (props: YFormSlotsSubMitProps) => VNode[]
}
export interface YFormInjection {
  getForm: () => FormContext<WritableComputedRef<dynamic, dynamic>>
  validate: () => Promise<boolean>
  setFieldValidate: (key: string, schema: YFormPropsSchema) => void
}

export const YFormInjectionKey: InjectionKey<YFormInjection> = Symbol('InjectionKey<YFormInjection>')

export default componentInstallToPlugin(_c)

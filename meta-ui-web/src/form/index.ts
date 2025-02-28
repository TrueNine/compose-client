import type { ModelValueEmits, ModelValueProps } from '@/common'
import type { dynamic, Maybe } from '@compose/api-types'
import type { FormSlotProps, InvalidSubmissionContext, Form as VeeFrom } from 'vee-validate'
import type { InjectionKey, VNode } from 'vue'

import type { ObjectSchema } from 'yup'

import { componentInstallToPlugin } from '@compose/extensions/vue'
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
export interface YFormProps extends ModelValueProps<dynamic>, FormAttribute {

  /**
   * 表单名称
   */
  name?: string

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
  /**
   * 初始值
   */
  initValue?: dynamic
}

export interface YFormEmits extends ModelValueEmits<dynamic> {
  (e: 'update:isValid', v: boolean): void

  (e: 'submit' | 'next', values?: dynamic, step?: number): void

  (e: 'reset' | 'update:everyStep', values?: dynamic, isValid?: boolean): void

  (e: 'update:step', v: number): void

  (e: 'error', ctx: InvalidSubmissionContext): void
}

export interface YFormSlots {
  default: (props: FormSlotProps) => VNode[]
}
export interface YFormInjection {
  getForm: () => InstanceType<typeof VeeFrom> | undefined
  validate: () => Promise<boolean>
  setFieldValidate: (key: string, schema: ObjectSchema<dynamic>) => void
}

export const YFormInjectionKey: InjectionKey<YFormInjection> = Symbol('InjectionKey<YFormInjection>')

export default componentInstallToPlugin(_c)

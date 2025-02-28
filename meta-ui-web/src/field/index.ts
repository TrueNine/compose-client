import type { FormFieldEmits, FormFieldProps } from '@/common/VuePropsCommon'
import type { dynamic, Maybe } from '@compose/api-types'
import type { RuleExpression } from 'vee-validate'

import type { VNode } from 'vue'
import type { ZodSchema } from 'zod'
import { componentInstallToPlugin } from '@compose/extensions/vue'
import _c from './YField.vue'

export type YFieldEffectModelsType = string | Record<string, string> | (string | Record<string, string>)[]

export interface YFieldProps {
  label?: string
  placeholder?: string
  name: string
  errorMessages?: Maybe<string>
  modelName?: string
  rule?: RuleExpression<unknown>
  schema?: ZodSchema
  syncVModel?: boolean | string
  effectModels?: YFieldEffectModelsType
  modelValue?: dynamic
}

export interface YFieldEmits {
  (e: 'update:modelValue' | 'change', v?: dynamic): void
  (e: 'update:errorMessages', v?: Maybe<string>): void
}

type _AnyOnUpdates = Partial<Record<`onUpdate:${string}`, (v?: dynamic) => void>>

export type YFieldSlotsProps = _AnyOnUpdates & FormFieldProps<dynamic> & FormFieldEmits<dynamic>

export interface YFieldSlots {
  default?: (props?: YFieldSlotsProps) => VNode[]
}

const a = componentInstallToPlugin(_c)
export default a

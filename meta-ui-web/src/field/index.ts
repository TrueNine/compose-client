import type { FormFieldEmits, FormFieldProps } from '@/common/VuePropsCommon'
import type { dynamic, Maybe } from '@compose/api-types'

import type { VNode } from 'vue'
import { componentInstallToPlugin } from '@/common'

import _c from './YField.vue'
import YFieldProxyComponent from './YFieldProxyComponent.vue'

export type YFieldEffectModelsType = string | Record<string, string> | (string | Record<string, string>)[]

export interface YFieldProps {
  name: YFieldEffectModelsType
  label?: string
  placeholder?: string
  errorMessages?: Maybe<string>
  modelValue?: dynamic
}

export interface YFieldEmits {
  (e: 'update:modelValue' | 'change', v?: dynamic): void
  (e: 'update:errorMessages', v?: Maybe<string>): void
}

type _AnyOnUpdates = Partial<Record<`onUpdate:${string}`, (v?: dynamic) => void>>

export type YFieldSlotsProps = _AnyOnUpdates & FormFieldProps<dynamic> & FormFieldEmits<dynamic>

export interface YFieldSlots {
  default: () => VNode[]
}

export default componentInstallToPlugin(_c, { YFieldProxyComponent })

import {Vue} from '@compose/extensions/vue'
import type {Schema} from 'yup'
import type {dynamic} from '@compose/api-types'
import type {FormFieldProps, FormFieldEmits} from '@/common/VuePropsCommon'

import _c from './YField.vue'

export type YFieldEffectModelsType = string | Record<string, string> | (string | Record<string, string>)[]

export interface YFieldProps {
  label?: string
  placeholder?: string
  name: string
  modelName?: string
  schema?: Schema<dynamic, dynamic>
  syncVModel?: boolean | string
  effectModels?: YFieldEffectModelsType
  modelValue?: dynamic
}

export interface YFieldEmits {
  (e: 'update:modelValue'): void
}

type _AnyOnUpdates = {
  [k in `onUpdate:${string}`]?: (v?: dynamic) => void
}

export interface YFieldSlots extends _AnyOnUpdates, FormFieldProps<dynamic>, FormFieldEmits<dynamic> {}

const a = Vue.componentInstallToPlugin(_c)

export default a

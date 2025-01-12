import {Vue} from '@compose/extensions/vue'
import type {Schema} from 'yup'
import type {dynamic} from '@compose/api-types'

import _c from './YField.vue'
export type YFieldEffectModelsType = string | Record<string, string> | (string | Record<string, string>)[]
export interface YFieldProps {
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

type _Be = {
  [k in `onUpdate:${string}`]?: (v?: dynamic) => void
}
export interface YFieldSlots extends _Be {
  modelValue?: dynamic
  errorMessages?: string[]
  hint?: string
  persistentHint?: boolean
  'onUpdate:modelValue'?: (v?: dynamic) => void
  'onUpdate:errorMessages'?: (v?: string[]) => void
}
const a = Vue.componentInstallToPlugin(_c)

export default a

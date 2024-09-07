import {Vue} from '@compose/extensions/vue'
import type {Schema} from 'yup'
import type {dynamic} from '@compose/api-types'

import _c from './YField.vue'

export interface YFieldProps {
  name: string
  modelName?: string
  schema?: Schema<dynamic, dynamic>
  syncVModel?: boolean | string
  effectModels?: Record<string, string>
  modelValue?: dynamic
}
export interface YFieldEmits {
  (e: 'update:modelValue'): void
}

const a = Vue.componentInstallToPlugin<YFieldProps>(_c)

export default a

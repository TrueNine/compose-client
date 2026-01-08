import type {dynamic, Maybe} from '@truenine/types'
import type {VNode} from 'vue'
import type {SFCWithInstall} from '@/common/install'

import type {FormFieldEmits, FormFieldProps} from '@/common/VuePropsCommon'
import {componentInstallToPlugin} from '@/common'

import YField from './YField.vue'
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
  'update:modelValue': [v?: dynamic]
  'change': [v?: dynamic]
  'update:errorMessages': [v?: Maybe<string>]
}

type _AnyOnUpdates = Partial<Record<`onUpdate:${string}`, (v?: dynamic) => void>>

export type YFieldSlotsProps = _AnyOnUpdates & FormFieldProps<dynamic> & FormFieldEmits<dynamic>

export interface YFieldSlots {
  default: () => VNode[]
}

const YFieldPlugin: SFCWithInstall<typeof YField> = componentInstallToPlugin(YField, {YFieldProxyComponent})
export default YFieldPlugin

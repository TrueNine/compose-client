import type {StrOrNum} from '@truenine/types'
import type {Schema} from 'yup'

/**
 * ## 可变换组件 Props
 */
export interface ResizeOption {
  width?: StrOrNum
  height?: StrOrNum
  maxWidth?: StrOrNum
  maxHeight?: StrOrNum
  minWidth?: StrOrNum
  minHeight?: StrOrNum
}

/**
 * # 可绑定值 Props
 */
export interface ModelValueProps<T = unknown> {
  modelValue?: T
}

/**
 * # 可绑定值 Emits
 */
export interface ModelValueEmits<T = unknown> {
  'update:modelValue': [value: T]
  'change': [value: T]
}

export interface FormFieldStyleProps {
  defaultValidateSchema?: () => Schema
  label?: string
  placeholder?: string
  errorMessages?: string[]
  persistentHint?: boolean
  hint?: string
  required?: boolean
}

/**
 * field Props
 */
export interface FormFieldProps<V = unknown> extends ModelValueProps<V>, FormFieldStyleProps { }

export interface FormFieldStyleEmits {
  'update:errorMessages': [msg: string[]]
  'update:hint': [hint: string]
  'update:persistentHint': [v: boolean]
  'update:required': [v: boolean]
}

/**
 * field emits
 */
export interface FormFieldEmits<T = unknown> extends FormFieldStyleEmits, ModelValueEmits<T> { }

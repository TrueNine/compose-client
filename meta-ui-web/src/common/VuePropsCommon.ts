import type {asyncable, dynamic, late, Maybe, StrOrNum} from '@compose/api-types'
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
  /**
   *
   * @deprecated 不建议使用
   * @see modelValue
   */
  value?: T
}

/**
 * # 可绑定值 Emits
 */
export interface ModelValueEmits<T = unknown> {
  (e: 'update:modelValue', value: T): void

  /**
   *
   * @deprecated 不建议使用
   * @see modelValue
   */
  (e: 'update:value', value: T): void
}

export interface FormFieldStyleProps {
  /**
   * ## 组件 的默认校验逻辑
   * 一般 无需设置此值 ，仅当你自定义组件时
   *
   * 此  prop 会在 prop 内被调用，当当前字段无 校验 schema 时
   */
  defaultValidateSchema?: () => asyncable<late<Schema<dynamic, dynamic>>>
  label?: string
  placeholder?: string
  errorMessages?: Maybe<string>
  persistentHint?: boolean
  hint?: string
  required?: boolean
}
export interface FormFieldProps<V = unknown> extends ModelValueProps<V>, FormFieldStyleProps {}

export interface FormFieldStyleEmits {
  (e: 'update:errorMessages', msg?: Maybe<string>): void
  (e: 'update:hint', hind?: string): void
  (e: 'update:persistentHint', persistentHint?: boolean): void
  (e: 'update:required', required?: boolean): void
}
export interface FormFieldEmits<T = unknown> extends FormFieldStyleEmits, ModelValueEmits<T> {}

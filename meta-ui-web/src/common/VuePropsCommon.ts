import type { StrOrNum } from '@compose/api-types'
import type { Schema } from 'yup'

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
export type ModelValueEmits<T = unknown> = (e: 'update:modelValue' | 'change', value: T) => void

export interface FormFieldStyleProps {
  /**
   * ## 组件 的默认校验逻辑
   * 一般 无需设置此值 ，仅当你自定义组件时
   *
   * 此  prop 会在 prop 内被调用，当当前字段无 校验 schema 时
   */
  defaultValidateSchema?: () => Schema
  /**
   * 组件标签
   */
  label?: string
  /**
   * 占位符提示
   */
  placeholder?: string
  /**
   * 错误信息
   */
  errorMessages?: string[]
  /**
   * 是否一直显示提示信息
   */
  persistentHint?: boolean
  /**
   * 当前 字段的提示信息
   */
  hint?: string
  /**
   * 该字段是否必须
   */
  required?: boolean
}

/**
 * field Props
 */
export interface FormFieldProps<V = unknown> extends ModelValueProps<V>, FormFieldStyleProps {}

export interface FormFieldStyleEmits {
  (e: 'update:errorMessages', msg: string[]): void

  (e: 'update:hint', hind: string): void

  (e: 'update:persistentHint' | 'update:required', v: boolean): void
}

/**
 * field emits
 */
export interface FormFieldEmits<T = unknown> extends FormFieldStyleEmits, ModelValueEmits<T> {}

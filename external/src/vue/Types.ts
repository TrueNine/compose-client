import type { dynamic } from '@truenine/types'

type NativeType = null | number | string | boolean | symbol | ((...args: dynamic) => dynamic)

type InferDefault<P, T> = ((props: P) => T & {}) | (T extends NativeType ? T : never)
/**
 * # props 声明默认值
 */
export type InferDefaults<T> = {
  [K in keyof T]?: InferDefault<T, T[K]>
}

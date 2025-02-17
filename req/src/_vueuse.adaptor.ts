import type {dynamic} from '@compose/api-types'
import {isClient} from '@vueuse/shared'
export type IfAny<T, Y, N> = 0 extends 1 & T ? Y : N

export type IsAny<T> = IfAny<T, true, false>

export type EventHookOn<T = dynamic> = (fn: Callback<T>) => {
  off: () => void
}

export type Callback<T> = IsAny<T> extends true ? (param: dynamic) => void : [T] extends [undefined] ? () => void : (param: T) => void
export const defaultWindow = /* #__PURE__ */ isClient ? window : void 0

export type Fn = () => void

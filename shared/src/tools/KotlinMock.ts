import type { late } from '@truenine/types'

export function takeIf<T>(value: late<T>, predicate: (value: T) => boolean = (v) => Boolean(v)): late<T> {
  return value !== void 0 && predicate(value) ? value : void 0
}

export function takeUnless<T>(value: late<T>, predicate: (value: T) => boolean = (v) => Boolean(v)): late<T> {
  return value !== void 0 && !predicate(value) ? value : void 0
}

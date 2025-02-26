import type { late } from '@compose/api-types'

export function takeIf<T>(value: late<T>, predicate: (value: T) => boolean = v => !!v): late<T> {
  return value && predicate(value) ? value : void 0
}

export function takeUnless<T>(value: late<T>, predicate: (value: T) => boolean = v => !!v): late<T> {
  return value && !predicate(value) ? value : void 0
}

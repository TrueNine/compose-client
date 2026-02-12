export function mergeWithDefaults<T extends object>(
  value: boolean | T | null | undefined,
  defaults: T
): T
export function mergeWithDefaults<T extends object>(
  value: boolean | T | null | undefined,
  defaults: boolean
): boolean | T
export function mergeWithDefaults<T extends object>(
  value: boolean | T | null | undefined,
  defaults: boolean | T | null | undefined
): boolean | T {
  if (defaults === false || defaults === null || defaults === void 0) {
    if (value === true) return true
    if (value === false || value === null) return false
    return value as T
  }

  if (value === void 0) return defaults
  if (value === false || value === null) return false
  if (value === true) return defaults

  if (typeof value === 'object' && typeof defaults === 'object') return {...defaults, ...value}

  return value
}

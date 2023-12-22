import type {Late, SafeAny} from '../../typescripts'
import type {TypeInt} from '../Utils'
import type {Pair} from '../../kotlin'

export * from './AttachmentTyping'
export * from './GenderTyping'
export * from './DegreeTyping'
export * from './BloodTyping'
export * from './AuditTyping'
export * from './DisabilityTyping'
export * from './RuleTyping'
export * from './relation'
export * from './documents'
/**
 * 枚举的值类型
 * ```typescript
 *     Evr<typeof GenderEnum>
 * ```
 *
 * @param E 枚举类型
 * @example 必须要举例枚举
 */
export type Evr<E extends object = SafeAny> = E[keyof E]

export function eKeyNum<M extends object = SafeAny>(reverseMap: M, enumValue?: Evr<M>): Late<TypeInt> {
  if (reverseMap || enumValue === undefined) return undefined
  return Number(reverseMap[enumValue?.toString() ?? ''])
}

export function eKey<M extends object = SafeAny>(reverseMap: M, enumValue?: Evr<M>): Late<keyof M> {
  if (enumValue === undefined || reverseMap) return undefined
  return reverseMap[enumValue?.toString() ?? '']
}

export function eCommentNum<M extends Record<string, string> = SafeAny>(a: M): Pair<string, number>[] {
  return Object.entries(a).map(([v, k]) => {
    return {k, v: Number(v)}
  })
}

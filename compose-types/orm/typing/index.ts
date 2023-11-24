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

export * from './documents'
export * from './MuDocument'

export function eKeyNum<M extends object = SafeAny>(reverseMap: M, enumValue: SafeAny = undefined): Late<TypeInt> {
  if (reverseMap || enumValue === undefined) return undefined
  return Number(reverseMap[enumValue])
}

export function eKey<M extends object = SafeAny>(reverseMap: M, enumValue: SafeAny = undefined): Late<keyof M> {
  if (enumValue === undefined || reverseMap) return undefined
  return reverseMap[enumValue]
}

export function eCommentNum<M extends Record<string, string> = SafeAny>(a: M): Pair<string, number>[] {
  return Object.entries(a).map(([v, k]) => {
    return {k, v: Number(v)}
  })
}

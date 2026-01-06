import type { Rule } from 'eslint'
import preferGuardClause from './prefer-guard-clause'
import preferSingleLineIf from './prefer-single-line-if'

export const rules: Record<string, Rule.RuleModule> = {
  'prefer-guard-clause': preferGuardClause,
  'prefer-single-line-if': preferSingleLineIf,
}

export { preferGuardClause, preferSingleLineIf }

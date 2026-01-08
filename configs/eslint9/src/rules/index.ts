import type { Rule } from 'eslint'
import preferGuardClause from './prefer-guard-clause'
import preferSingleLineControl from './prefer-single-line-control'
import preferSingleLineIf from './prefer-single-line-if'

export const rules: Record<string, Rule.RuleModule> = {
  'prefer-guard-clause': preferGuardClause,
  'prefer-single-line-control': preferSingleLineControl,
  'prefer-single-line-if': preferSingleLineIf,
}

export { default as preferGuardClause } from './prefer-guard-clause'
export { default as preferSingleLineControl } from './prefer-single-line-control'
export { default as preferSingleLineIf } from './prefer-single-line-if'

import type {Rule} from 'eslint'
import preferConciseArrow from './concise-arrow'
import preferGuardClause from './guard-clause'
import preferLookupTable from './prefer-lookup-table'
import preferSeparateTryCatch from './prefer-separate-try-catch'
import preferVoidZero from './prefer-void-zero'

/**
 * Code style rules
 *
 * These rules enforce code style preferences for better readability
 * and maintainability.
 */
export const codeStyleRules: Record<string, Rule.RuleModule> = {
  'prefer-concise-arrow': preferConciseArrow,
  'prefer-guard-clause': preferGuardClause,
  'prefer-void-zero': preferVoidZero,
  'prefer-lookup-table': preferLookupTable,
  'prefer-separate-try-catch': preferSeparateTryCatch,
}

export {default as preferConciseArrow} from './concise-arrow'
export {default as preferGuardClause} from './guard-clause'
export {default as preferLookupTable} from './prefer-lookup-table'
export {default as preferSeparateTryCatch} from './prefer-separate-try-catch'
export {default as preferVoidZero} from './prefer-void-zero'

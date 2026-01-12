import type {Rule} from 'eslint'
import preferConciseArrow from './concise-arrow'
import preferGuardClause from './guard-clause'

/**
 * Code style rules
 *
 * These rules enforce code style preferences for better readability
 * and maintainability.
 */
export const codeStyleRules: Record<string, Rule.RuleModule> = {'prefer-concise-arrow': preferConciseArrow,
  'prefer-guard-clause': preferGuardClause}

export {default as preferConciseArrow} from './concise-arrow'
export {default as preferGuardClause} from './guard-clause'

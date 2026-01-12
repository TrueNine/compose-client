import type {Rule} from 'eslint'
import preferConciseArrow from './prefer-concise-arrow'
import preferGuardClause from './prefer-guard-clause'
import preferSingleLineCall from './prefer-single-line-call'
import preferSingleLineControl from './prefer-single-line-control'
import preferSingleLineIf from './prefer-single-line-if'

export const rules: Record<string, Rule.RuleModule> = {
  'prefer-concise-arrow': preferConciseArrow,
  'prefer-guard-clause': preferGuardClause,
  'prefer-single-line-call': preferSingleLineCall,
  'prefer-single-line-control': preferSingleLineControl,
  'prefer-single-line-if': preferSingleLineIf,
}

export {default as preferConciseArrow} from './prefer-concise-arrow'
export {default as preferGuardClause} from './prefer-guard-clause'
export {default as preferSingleLineCall} from './prefer-single-line-call'
export {default as preferSingleLineControl} from './prefer-single-line-control'
export {default as preferSingleLineIf} from './prefer-single-line-if'

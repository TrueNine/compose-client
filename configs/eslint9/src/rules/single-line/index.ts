import type {Rule} from 'eslint'
import preferSingleLineCall from './call'
import preferSingleLineControl from './control'
import preferSingleLineIf from './if'

/**
 * Single-line formatting rules
 * These rules prefer single-line format for simple statements when possible,
 * improving code readability and reducing vertical space.
 */
export const singleLineRules: Record<string, Rule.RuleModule> = {
  'prefer-single-line-call': preferSingleLineCall,
  'prefer-single-line-control': preferSingleLineControl,
  'prefer-single-line-if': preferSingleLineIf,
}

export {default as preferSingleLineCall} from './call'
export {default as preferSingleLineControl} from './control'
export {default as preferSingleLineIf} from './if'

import type {Rule} from 'eslint'
import {codeStyleRules} from './code-style'
import {singleLineRules} from './single-line'

/**
 * All custom ESLint rules
 *
 * Rules are organized into categories:
 * - single-line: Rules that prefer single-line format for simple statements
 * - code-style: Rules that enforce code style preferences
 */
export const rules: Record<string, Rule.RuleModule> = {...singleLineRules, ...codeStyleRules}

// Re-export all rules from subdirectories
export * from './code-style'
export * from './single-line'

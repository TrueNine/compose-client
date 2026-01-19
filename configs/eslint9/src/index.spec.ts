import {describe, expect, it} from 'vitest'
import defineConfig, {plugin, rules} from './index'
import {codeStyleRules} from './rules/code-style'
import {singleLineRules} from './rules/single-line'

describe('eslint9-config', () => {
  it('should export defineConfig as default function', () => expect(typeof defineConfig).toBe('function'))

  it('should export plugin object', () => {
    expect(typeof plugin).toBe('object')
    expect(plugin.meta?.name).toBe('@truenine/eslint-plugin')
  })

  it('should export rules object', () => {
    expect(typeof rules).toBe('object')
    expect(Object.keys(rules).length).toBeGreaterThan(0)
  })

  it('should return a promise', async () => {
    const result = defineConfig()
    expect(result).toBeInstanceOf(Promise)
  })

  it('should contain all custom rules in plugin', () => {
    const ruleNames = Object.keys(rules)
    const pluginRuleNames = Object.keys(plugin.rules ?? {})
    expect(pluginRuleNames).toEqual(expect.arrayContaining(ruleNames))
  })
})

/**
 * Property-Based Tests for ESLint9 Config
 * These tests validate correctness properties that should hold true
 * across all valid executions of the system.
 */
describe('property-Based Tests', () => {
  describe('property 1: Rules Export Completeness', () => {
    it('should export all single-line rules from rules/index.ts', () => {
      const singleLineRuleNames = Object.keys(singleLineRules)
      for (const ruleName of singleLineRuleNames) { /* For all rules in single-line subdirectory */
        expect(rules).toHaveProperty(ruleName)
        expect(rules[ruleName]).toBe(singleLineRules[ruleName])
      }
    })

    it('should export all code-style rules from rules/index.ts', () => {
      const codeStyleRuleNames = Object.keys(codeStyleRules)
      for (const ruleName of codeStyleRuleNames) { /* For all rules in code-style subdirectory */
        expect(rules).toHaveProperty(ruleName)
        expect(rules[ruleName]).toBe(codeStyleRules[ruleName])
      }
    })

    it('should have exactly the combined count of subdirectory rules', () => {
      const expectedCount = Object.keys(singleLineRules).length + Object.keys(codeStyleRules).length
      const actualCount = Object.keys(rules).length
      expect(actualCount).toBe(expectedCount)
    })

    it('should export all expected rule names', () => {
      const expectedRuleNames = [
        'prefer-single-line-if',
        'prefer-single-line-control',
        'prefer-single-line-call',
        'prefer-concise-arrow',
        'prefer-guard-clause',
        'prefer-void-zero',
        'prefer-lookup-table',
        'compact-try-catch',
        'beside-comment',
        'prefer-separate-try-catch',
        'brace-style'
      ]
      for (const ruleName of expectedRuleNames) {
        expect(rules).toHaveProperty(ruleName)
        expect(typeof rules[ruleName]).toBe('object')
        expect(rules[ruleName]).toHaveProperty('create')
      }
    })
  })

  describe('property 2: Plugin Contains All Rules', () => {
    it('should have plugin.rules containing all exported rules', () => {
      const exportedRuleNames = Object.keys(rules)
      const pluginRules = plugin.rules ?? {}
      for (const ruleName of exportedRuleNames) expect(pluginRules).toHaveProperty(ruleName) /* For all rules exported from rules/index.ts */
    })

    it('should have plugin.rules with identical rule modules', () => {
      const exportedRuleNames = Object.keys(rules)
      const pluginRules = plugin.rules ?? {}
      for (const ruleName of exportedRuleNames) expect(pluginRules[ruleName]).toBe(rules[ruleName]) /* For all rules, the plugin should contain the exact same rule module */
    })

    it('should have plugin.rules with same count as exported rules', () => {
      const exportedRuleCount = Object.keys(rules).length
      const pluginRuleCount = Object.keys(plugin.rules ?? {}).length
      expect(pluginRuleCount).toBe(exportedRuleCount)
    })

    it('should have valid ESLint rule modules in plugin', () => {
      const pluginRules = plugin.rules ?? {}
      for (const [ruleName, ruleModule] of Object.entries(pluginRules)) { /* For all rules in plugin, they should be valid ESLint rule modules */
        expect(typeof ruleModule).toBe('object')
        expect(ruleModule).toHaveProperty('create')
        expect(typeof ruleModule.create).toBe('function')
        expect(ruleName).toMatch(/^(prefer|beside|compact|brace)-[a-z-]+$/) /* Rule name should follow expected naming convention */
      }
    })
  })
})

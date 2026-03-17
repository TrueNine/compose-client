import type {Linter} from 'eslint'
import {describe, expect, it} from 'vitest'
import defineConfig, {plugin, rules} from './index'
import {codeStyleRules} from './rules/code-style'
import {singleLineRules} from './rules/single-line'

type RuleEntry = Linter.RuleEntry
type RulesRecord = Record<string, RuleEntry>
type ConfigResult = Awaited<ReturnType<typeof defineConfig>>

function findRuleEntry(configs: ConfigResult, ruleName: string): RuleEntry | undefined {
  if (!Array.isArray(configs)) return void 0
  for (const config of configs) {
    if (typeof config !== 'object' || config === null) continue
    const {rules} = config
    if (!rules || typeof rules !== 'object') continue
    const record = rules as RulesRecord
    if (ruleName in record) return record[ruleName]
  }
  return void 0
}

function extractRuleSetting(rule: RuleEntry | undefined): string | undefined {
  if (!Array.isArray(rule)) return void 0
  const setting = rule[1]
  return typeof setting === 'string' ? setting : void 0
}

function isRuleDisabled(rule: RuleEntry | undefined): boolean {
  if (rule === 'off') return true
  return Array.isArray(rule) && rule[0] === 'off'
}

function findConfig(configs: ConfigResult, name: string): Linter.Config | undefined {
  for (const config of configs) {
    if (typeof config !== 'object' || config === null) continue
    if (config.name === name) return config
  }
  return void 0
}

describe('eslint10-config', () => {
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

describe('uniapp options', () => {
  it('should enforce kebab-case component names in templates', async () => {
    const config = await defineConfig({vue: true, uniapp: true})
    const rule = findRuleEntry(config, 'vue/component-name-in-template-casing')
    expect(extractRuleSetting(rule)).toBe('kebab-case')
  }, 20_000)

  it('should enforce kebab-case attribute hyphenation', async () => {
    const config = await defineConfig({vue: true, uniapp: true})
    const rule = findRuleEntry(config, 'vue/attribute-hyphenation')
    expect(extractRuleSetting(rule)).toBe('always')
  })

  it('should keep default casing when uniapp is disabled', async () => {
    const config = await defineConfig({vue: true})
    const componentCasing = findRuleEntry(config, 'vue/component-name-in-template-casing')
    const attributeHyphenation = findRuleEntry(config, 'vue/attribute-hyphenation')
    expect(extractRuleSetting(componentCasing)).toBe('PascalCase')
    expect(extractRuleSetting(attributeHyphenation)).toBe('never')
  })
})

describe('profiles and boundaries', () => {
  it('should default to the ai profile', async () => {
    const config = await defineConfig()
    const sourceRules = findConfig(config, '@truenine/ai-source-rules')
    expect(sourceRules?.rules?.['@truenine/no-task-comment']).toBe('error')
    expect(sourceRules?.rules?.['@truenine/prefer-single-line-if']).toBeUndefined()
  })

  it('should enable compact rules only when compact profile is selected', async () => {
    const config = await defineConfig({profile: 'compact'})
    const sourceRules = findConfig(config, '@truenine/compact-source-rules')
    expect(sourceRules?.rules?.['@truenine/no-task-comment']).toBe('error')
    expect(sourceRules?.rules?.['@truenine/prefer-single-line-if']).toBe('warn')
    expect(sourceRules?.rules?.['@truenine/prefer-concise-arrow']).toBe('warn')
  })

  it('should keep source-only task comment enforcement away from tests and docs', async () => {
    const config = await defineConfig()
    const sourceRules = findConfig(config, '@truenine/ai-source-rules')
    expect(sourceRules?.files).toEqual(expect.arrayContaining(['**/*.ts', '**/*.vue']))
    expect(sourceRules?.ignores).toEqual(expect.arrayContaining(['**/*.spec.*', '**/*.md', '**/*.md/**']))
  })

  it('should disable markdown-hostile rules inside markdown code blocks', async () => {
    const config = await defineConfig()
    expect(config.some(item => isRuleDisabled(item.rules?.['@truenine/beside-comment']))).toBe(true)
    expect(config.some(item => isRuleDisabled(item.rules?.['style/object-curly-spacing']))).toBe(true)
    expect(config.some(item => isRuleDisabled(item.rules?.['@truenine/no-task-comment']))).toBe(true)
  })

  it('should merge strict TypeScript defaults instead of replacing them', async () => {
    const config = await defineConfig({typescript: {strictTypescriptEslint: true, tsconfigPath: './tsconfig.json'}})
    expect(findRuleEntry(config, 'ts/no-explicit-any')).toEqual(['error', {fixToUnknown: true, ignoreRestArgs: true}])
    expect(findRuleEntry(config, 'ts/no-non-null-assertion')).toBe('error')
    expect(findRuleEntry(config, 'ts/no-floating-promises')).toBe('error')
    expect(findRuleEntry(config, 'ts/no-unused-vars')).toEqual([
      'error',
      {vars: 'all', args: 'after-used', ignoreRestSiblings: false}
    ])
  })
})

describe('rule exports', () => {
  it('should export all single-line rules from rules/index.ts', () => {
    const singleLineRuleNames = Object.keys(singleLineRules)
    for (const ruleName of singleLineRuleNames) {
      expect(rules).toHaveProperty(ruleName)
      expect(rules[ruleName]).toBe(singleLineRules[ruleName])
    }
  })

  it('should export all code-style rules from rules/index.ts', () => {
    const codeStyleRuleNames = Object.keys(codeStyleRules)
    for (const ruleName of codeStyleRuleNames) {
      expect(rules).toHaveProperty(ruleName)
      expect(rules[ruleName]).toBe(codeStyleRules[ruleName])
    }
  })

  it('should exclude brace-style from the published custom rules', () => {
    expect(rules).not.toHaveProperty('brace-style')
    expect(plugin.rules).not.toHaveProperty('brace-style')
  })

  it('should have plugin.rules containing all exported rules', () => {
    const exportedRuleNames = Object.keys(rules)
    const pluginRules = plugin.rules ?? {}
    for (const ruleName of exportedRuleNames) expect(pluginRules).toHaveProperty(ruleName)
  })

  it('should have valid ESLint rule modules in plugin', () => {
    const pluginRules = plugin.rules ?? {}
    for (const [ruleName, ruleModule] of Object.entries(pluginRules)) {
      expect(typeof ruleModule).toBe('object')
      expect(ruleModule).toHaveProperty('create')
      expect(typeof ruleModule.create).toBe('function')
      expect(ruleName).toMatch(/^(prefer|beside|compact|no)-[a-z-]+$/)
    }
  })
})

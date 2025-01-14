import globals from 'globals'

import unocss from '@unocss/eslint-config/flat'

import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import {ComposeGlobals, EchartsGlobals} from '@/globals'
import pluginPrettierRecommendedConfigs from 'eslint-plugin-prettier/recommended'

import parserVue from 'vue-eslint-parser'
import type {FlatESLintConfig, Parser, Rules} from 'eslint-define-config'
import {VueRules} from '@/rules'
import {TypescriptRules} from '@/rules/TypescriptRules'
import {EcmaRules} from '@/rules/EcmaRules'
import oxlint from 'eslint-plugin-oxlint'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

const DefinedConfig = [
  {
    ignores: [
      'dist',
      '__build-src__',
      'vite.config.*',
      'vitest.config.*',
      'playwright.config.*',
      'rollup.config.*',
      'uno.config.*',
      '**/example/**',
      '**/examples/**',
      'node_modules',
      '__tests__',
      '__test__',
      'playground'
    ]
  },
  unocss,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...ComposeGlobals,
        ...EchartsGlobals
      }
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginVue.configs['flat/strongly-recommended'],
  pluginPrettierRecommendedConfigs,
  {
    rules: {
      ...EcmaRules,
      ...TypescriptRules
    } as Partial<Rules>
  },
  {
    files: ['**/*.vue'],
    rules: {...VueRules},
    languageOptions: {
      ecmaVersion: 'latest',
      parser: parserVue,
      parserOptions: {
        ecmaFeatures: {jsx: true},
        parser: tseslint.parser as unknown as Parser
      }
    }
  } as FlatESLintConfig,
  oxlint.configs['flat/recommended'],
  skipFormatting
]
export {globals, DefinedConfig}

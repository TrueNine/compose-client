import globals from 'globals'

import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import pluginVue from 'eslint-plugin-vue'
import {ComposeGlobals} from '@/globals'
import pluginPrettierRecommendedConfigs from 'eslint-plugin-prettier/recommended'

import parserVue from 'vue-eslint-parser'
import type {FlatESLintConfig, Parser, Rules} from 'eslint-define-config'
import {VueRules} from '@/rules'
import {TypescriptRules} from '@/rules/TypescriptRules'
import {EcmaRules} from '@/rules/EcmaRules'

export {globals}

export const DefinedConfig = [
  {
    ignores: [
      'dist',
      '__build-src__',
      'vite.config.*',
      'vitest.config.*',
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
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...ComposeGlobals
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
  } as FlatESLintConfig
]

import type { ESLint } from 'eslint'
import { rules } from './rules'

export const plugin: ESLint.Plugin = {
  meta: {
    name: '@truenine/eslint-plugin',
    version: '1.0.0',
  },
  rules,
}

export default plugin

import { antfu } from '@antfu/eslint-config'
import { Formatters, TypescriptRules, VueRules } from '@compose/eslint9-config'

export default antfu({
  formatters: Formatters,
  type: 'lib',
  unocss: true,
  stylistic: {
    jsx: true,
  },
  vue: {
    overrides: VueRules.rules,
  },
  typescript: {
    overrides: TypescriptRules.rules,
  },
})

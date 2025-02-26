import { antfu } from '@antfu/eslint-config'
import { TypescriptRules } from '@compose/eslint9-config'

export default antfu({
  type: 'lib',
  unocss: true,
  typescript: {
    overrides: TypescriptRules.rules,
  },
})

import { antfu } from '@antfu/eslint-config'
import { TypescriptRules } from '@compose/eslint9-config'

export default antfu({
  type: 'lib',
  test: {

  },
  typescript: {
    overrides: TypescriptRules.rules,
  },
})

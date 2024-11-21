import {defineFlatConfig} from 'eslint-define-config'
import {DefinedConfig} from '@compose/eslint9-config'
import json from './imports-eslint.json' with {type: 'json'}

export default defineFlatConfig([
  ...DefinedConfig,
  {
    languageOptions: {
      globals: json.globals
    }
  }
])

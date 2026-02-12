import {RuleTester} from 'eslint'
import * as tseslint from 'typescript-eslint'
import {describe, it} from 'vitest'
import rule from './prefer-separate-try-catch'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parser: tseslint.parser
  }
})

describe('prefer-separate-try-catch', () => {
  it('should run rule tests', () => {
    ruleTester.run('prefer-separate-try-catch', rule, {
      valid: [
        {
          code: [
            'try {',
            '  stmt;',
            '}',
            'catch (e) {',
            '  handle(e);',
            '}'
          ].join('\n')
        },
        {
          code: [
            'try {',
            '  stmt;',
            '}',
            'finally {',
            '  cleanup();',
            '}'
          ].join('\n')
        }
      ],
      invalid: [
        {
          code: 'try {} catch (e) {}',
          output: 'try {}\ncatch (e) {}',
          errors: [{messageId: 'separateCatch'}]
        },
        {
          code: 'try {} finally {}',
          output: 'try {}\nfinally {}',
          errors: [{messageId: 'separateFinally'}]
        },
        {
          code: 'try {} catch (e) {} finally {}',
          output: 'try {}\ncatch (e) {}\nfinally {}',
          errors: [{messageId: 'separateCatch'}, {messageId: 'separateFinally'}]
        },
        {
          code: 'try {} catch (e) {} // comment',
          output: 'try {}\ncatch (e) {} // comment',
          errors: [{messageId: 'separateCatch'}]
        }
      ]
    })
  })
})

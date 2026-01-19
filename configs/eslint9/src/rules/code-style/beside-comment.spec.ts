import {RuleTester} from 'eslint'
import * as tseslint from 'typescript-eslint'
import {describe, it} from 'vitest'
import rule from './beside-comment'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parser: tseslint.parser
  }
})

describe('beside-comment', () => {
  it('should run rule tests', () => {
    ruleTester.run('beside-comment', rule, {
      valid: [
        {
          code: 'const a = 1; // comment'
        },
        {
          code: `
            // #if DEBUG
            const a = 1;
            // #endif
          `
        },
        {
          code: `
            // #if
            code();
            // #endif
          `
        },
        {
          code: `
            /**
             * JSDoc
             */
            const b = 2;
          `
        }
      ],
      invalid: [
        {
          code: [
            '// standalone',
            'const c = 3;'
          ].join('\n'),
          output: 'const c = 3; // standalone',
          errors: [{messageId: 'besideComment'}]
        }
      ]
    })
  })
})

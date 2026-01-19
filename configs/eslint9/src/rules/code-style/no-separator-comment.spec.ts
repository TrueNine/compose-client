import {RuleTester} from 'eslint'
import {describe, it} from 'vitest'
import rule from './no-separator-comment'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
})

describe('no-separator-comment', () => {
  it('runs', () => {
    ruleTester.run('no-separator-comment', rule, {
      valid: [
        '// Just a normal comment',
        'const a = 1; // Another comment',
        '/* Multiline \n comment */',
      ],
      invalid: [
        {
          code: '// ==== Separator ====',
          output: '',
          errors: [{messageId: 'noSeparatorComment'}],
        },
        {
          code: '// ---- Separator ----',
          output: '',
          errors: [{messageId: 'noSeparatorComment'}],
        },
        {
          code: `
            const a = 1;
            // ====
            const b = 2;
          `,
          output: `
            const a = 1;
            const b = 2;
          `,
          errors: [{messageId: 'noSeparatorComment'}],
        },
        {
          code: 'const a = 1; // ==== inline',
          output: 'const a = 1; ',
          errors: [{messageId: 'noSeparatorComment'}],
        },
        {
          code: `
            /*
             * ====
             */
          `,
          output: `
          `,
          errors: [{messageId: 'noSeparatorComment'}],
        },
      ],
    })
  })
})

import {RuleTester} from 'eslint'
import {describe, it} from 'vitest'
import rule from './no-task-comment'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

describe('no-task-comment', () => {
  it('runs', () => {
    ruleTester.run('no-task-comment', rule, {
      valid: [
        '// This is a normal comment',
        '/** Normal doc comment */',
        'const x = 1; // Not at start of comment'
      ],
      invalid: [
        {
          code: '// TODO: implement',
          errors: [{messageId: 'noTaskComment'}]
        },
        {
          code: '// FIXME: bug',
          errors: [{messageId: 'noTaskComment'}]
        },
        {
          code: '// todo: lowercase',
          errors: [{messageId: 'noTaskComment'}]
        },
        {
          code: `
            /**
             * TODO: add more
             */
          `,
          errors: [{messageId: 'noTaskComment'}]
        },
        {
          code: `
            /**
             * Description
             * FIXME: fix this
             */
          `,
          errors: [{messageId: 'noTaskComment'}]
        }
      ]
    })
  })
})

import {RuleTester} from 'eslint'
import {describe, it} from 'vitest'
import rule from './no-document-requirements'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  }
})

describe('no-document-requirements', () => {
  it('runs', () => {
    ruleTester.run('no-document-requirements', rule, {
      valid: [
        '/** Just a normal doc comment */',
        '/** * Requirement is ok if not at start of line */',
        '// Requirements (line comment is not document comment)'
      ],
      invalid: [
        {
          code: `
            /**
             * Requirements
             */
          `,
          output: `
          `,
          errors: [{messageId: 'noDocumentRequirements'}]
        },
        {
          code: `
            /**
             * Test Doc
             *
             * Requirements 1.1
             */
          `,
          output: `
            /**
             * Test Doc
             *
             */
          `,
          errors: [{messageId: 'noDocumentRequirements'}]
        },
        {
          code: `
            /**
             * Requirements: Support this
             * Original functionality
             */
          `,
          output: `
            /**
             * Original functionality
             */
          `,
          errors: [{messageId: 'noDocumentRequirements'}]
        }
      ]
    })
  })
})

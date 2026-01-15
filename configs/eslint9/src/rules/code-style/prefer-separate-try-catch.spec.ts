import {RuleTester} from 'eslint'
import * as tseslint from 'typescript-eslint'
import {describe, it} from 'vitest'
import rule from './prefer-separate-try-catch'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parser: tseslint.parser,
  },
})

describe('prefer-separate-try-catch', () => {
  describe('valid', () => {
    it('should allow blocks on separate lines', () => {
      ruleTester.run('prefer-separate-try-catch', rule, {
        valid: [
          'try {\n} \ncatch (e) {\n}',
          'try {\n} \nfinally {\n}',
          'try {\n} \ncatch (e) {\n} \nfinally {\n}',
          'try {}\ncatch {}\nfinally {}',
          // Start of file try is allowed by itself if no previous token
          'try {} \ncatch {}',
        ].map(code => ({code})),
        invalid: [],
      })
    })

    it('should allow try on separate line after if/loop', () => {
      ruleTester.run('prefer-separate-try-catch', rule, {
        valid: [
          'if (a) {\n  try {}\n  catch {}\n}',
          'do {\n  try {}\n  catch {}\n} while(0)',
        ],
        invalid: [],
      })
    })
  })

  describe('invalid - try keyword', () => {
    it('should report when try is on the same line as previous token', () => {
      ruleTester.run('prefer-separate-try-catch', rule, {
        valid: [],
        invalid: [
          {
            code: 'if (a) try {} catch {}',
            output: 'if (a) \ntry {} \ncatch {}',
            errors: [{messageId: 'separateTry'}, {messageId: 'separateCatch'}],
          },
        ],
      })
    })
  })

  describe('invalid - catch keyword', () => {
    it('should report when catch is on same line as try block', () => {
      ruleTester.run('prefer-separate-try-catch', rule, {
        valid: [],
        invalid: [
          {
            code: 'try {} catch (e) {}',
            output: 'try {} \ncatch (e) {}',
            errors: [{messageId: 'separateCatch'}],
          },
          {
            code: 'try {} catch {}',
            output: 'try {} \ncatch {}',
            errors: [{messageId: 'separateCatch'}],
          },
        ],
      })
    })
  })

  describe('invalid - finally keyword', () => {
    it('should report when finally is on same line as catch or try block', () => {
      ruleTester.run('prefer-separate-try-catch', rule, {
        valid: [],
        invalid: [
          {
            code: 'try {} catch {} finally {}',
            output: 'try {} \ncatch {} \nfinally {}',
            errors: [{messageId: 'separateCatch'}, {messageId: 'separateFinally'}],
          },
          {
            code: 'try {} finally {}',
            output: 'try {} \nfinally {}',
            errors: [{messageId: 'separateFinally'}],
          },
        ],
      })
    })
  })
})

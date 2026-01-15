import {RuleTester} from 'eslint'
import * as tseslint from 'typescript-eslint'
import {describe, it} from 'vitest'
import rule from './compact-try-catch'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parser: tseslint.parser,
  },
})

describe('compact-try-catch', () => {
  describe('valid', () => {
    it('should allow tiered layout', () => {
      ruleTester.run('compact-try-catch', rule, {
        valid: [
          'try {\n  a();\n  b();\n} catch (e) {\n  c();\n  d();\n}',
          'try { a(); }\ncatch (e) { b(); }',
          'try { a(); }\ncatch (e) { /* ignore */ }',
        ],
        invalid: [],
      })
    })
  })

  describe('invalid - compression with comments', () => {
    it('should compress catch with only comments', () => {
      ruleTester.run('compact-try-catch', rule, {
        valid: [],
        invalid: [
          {
            code: 'try { foo(); } catch (e) {\n  // ignore\n}',
            output: 'try { foo(); }\ncatch (e) { /* ignore */ }',
            errors: [
              {messageId: 'separateCatch'},
              {messageId: 'preferSingleLine'},
            ],
          },
        ],
      })
    })

    it('should compress finally with only comments', () => {
      ruleTester.run('compact-try-catch', rule, {
        valid: [],
        invalid: [
          {
            code: 'try { foo(); } finally {\n  // cleanup\n}',
            output: 'try { foo(); }\nfinally { /* cleanup */ }',
            errors: [
              {messageId: 'separateFinally'},
              {messageId: 'preferSingleLine'},
            ],
          },
        ],
      })
    })
  })

  describe('invalid - tiered layout', () => {
    it('should report incorrect layout for multi-line blocks', () => {
      ruleTester.run('compact-try-catch', rule, {
        valid: [],
        invalid: [
          {
            code: 'try {\n  a();\n  b();\n}\ncatch (e) { c(); }',
            output: 'try {\n  a();\n  b();\n} catch (e) { c(); }',
            errors: [
              {messageId: 'compactCatch'},
            ],
          },
        ],
      })
    })
  })
})

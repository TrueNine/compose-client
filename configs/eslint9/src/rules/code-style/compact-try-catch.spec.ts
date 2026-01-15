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
    it('should allow compact layout', () => {
      ruleTester.run('compact-try-catch', rule, {
        valid: [
          'try {\n  a();\n  b();\n} catch (e) {\n  c();\n  d();\n}', // Multi-line joined (Standard 1TBS)
          'try { a(); } catch (e) { b(); }', // Single-line joined (Standard 1TBS with allowSingleLine)
          'try { a(); } catch (e) { /* ignore */ }', // Single-line with comments
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
            code: 'try { foo(); } catch (e) {\n  // ignore\n}', // Input has catch on same line but multi-line body
            output: 'try { foo(); } catch (e) { /* ignore */ }',
            errors: [
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
            output: 'try { foo(); } finally { /* cleanup */ }',
            errors: [
              {messageId: 'preferSingleLine'},
            ],
          },
        ],
      })
    })
  })

  describe('invalid - layout', () => {
    it('should report incorrect layout for multi-line blocks', () => {
      ruleTester.run('compact-try-catch', rule, {
        valid: [],
        invalid: [
          {
            code: 'try {\n  a();\n  b();\n}\ncatch (e) { c(); }', // If try is multi-line, catch should be joined
            output: 'try {\n  a();\n  b();\n} catch (e) { c(); }',
            errors: [
              {messageId: 'compactCatch'},
            ],
          },
          {
            code: 'try { a(); } catch (e) {\n  b();\n  c();\n}\nfinally { d(); }', // If catch is multi-line, finally should be joined
            output: 'try { a(); } catch (e) {\n  b();\n  c();\n} finally { d(); }',
            errors: [
              {messageId: 'compactFinally'},
            ],
          },
        ],
      })
    })
  })
})

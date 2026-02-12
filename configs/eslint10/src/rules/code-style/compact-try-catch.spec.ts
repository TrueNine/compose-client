import {RuleTester} from 'eslint'
import * as tseslint from 'typescript-eslint'
import {describe, it} from 'vitest'
import rule from './compact-try-catch'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parser: tseslint.parser
  }
})

describe('compact-try-catch', () => {
  describe('valid', () => {
    it('should allow compact layout', () => {
      ruleTester.run('compact-try-catch', rule, {
        valid: [
          'try {\n  a();\n  b();\n} catch (e) {\n  c();\n  d();\n}',
          'try { a(); } catch (e) { b(); }',
          'try { a(); } catch (e) {}',
          'try {\n  const x = getAppBaseInfo();\n  if (x.theme) theme.value = x.theme;\n} catch (error) { console.error("error:", error); }'
        ],
        invalid: []
      })
    })
  })

  describe('invalid - independent block compression', () => {
    it('should compress try block independently', () => {
      ruleTester.run('compact-try-catch', rule, {
        valid: [],
        invalid: [
          {
            code: 'try {\n  foo();\n} catch (e) {\n  bar();\n  baz();\n}',
            output: 'try { foo(); } catch (e) {\n  bar();\n  baz();\n}',
            errors: [{messageId: 'preferSingleLineTry'}]
          }
        ]
      })
    })

    it('should compress catch block independently when try is multi-line', () => {
      ruleTester.run('compact-try-catch', rule, {
        valid: [],
        invalid: [
          {
            code: 'try {\n  const appBaseInfo = getAppBaseInfo();\n  if (appBaseInfo.theme) systemTheme.value = appBaseInfo.theme;\n} catch (error) {\n  console.error("获取系统主题失败:", error);\n}',
            output: 'try {\n  const appBaseInfo = getAppBaseInfo();\n  if (appBaseInfo.theme) systemTheme.value = appBaseInfo.theme;\n} catch (error) { console.error("获取系统主题失败:", error); }',
            errors: [{messageId: 'preferSingleLineCatch'}]
          }
        ]
      })
    })

    it('should compress finally block independently when try is multi-line', () => {
      ruleTester.run('compact-try-catch', rule, {
        valid: [],
        invalid: [
          {
            code: 'try {\n  foo();\n  bar();\n} finally {\n  cleanup();\n}',
            output: 'try {\n  foo();\n  bar();\n} finally { cleanup(); }',
            errors: [{messageId: 'preferSingleLineFinally'}]
          }
        ]
      })
    })

    it('should compress finally block independently when catch is multi-line', () => {
      ruleTester.run('compact-try-catch', rule, {
        valid: [],
        invalid: [
          {
            code: 'try { foo(); } catch (e) {\n  bar();\n  baz();\n} finally {\n  cleanup();\n}',
            output: 'try { foo(); } catch (e) {\n  bar();\n  baz();\n} finally { cleanup(); }',
            errors: [{messageId: 'preferSingleLineFinally'}]
          }
        ]
      })
    })

    it('should compress both catch and finally independently', () => {
      ruleTester.run('compact-try-catch', rule, {
        valid: [],
        invalid: [
          {
            code: 'try {\n  foo();\n  bar();\n} catch (e) {\n  log(e);\n} finally {\n  cleanup();\n}',
            output: 'try {\n  foo();\n  bar();\n} catch (e) { log(e); } finally { cleanup(); }',
            errors: [
              {messageId: 'preferSingleLineCatch'},
              {messageId: 'preferSingleLineFinally'}
            ]
          }
        ]
      })
    })

    it('should compress all three blocks when possible', () => {
      ruleTester.run('compact-try-catch', rule, {
        valid: [],
        invalid: [
          {
            code: 'try {\n  foo();\n} catch (e) {\n  bar();\n} finally {\n  baz();\n}',
            output: 'try { foo(); } catch (e) { bar(); } finally { baz(); }',
            errors: [
              {messageId: 'preferSingleLineTry'},
              {messageId: 'preferSingleLineCatch'},
              {messageId: 'preferSingleLineFinally'}
            ]
          }
        ]
      })
    })
  })

  describe('invalid - layout', () => {
    it('should report incorrect layout for multi-line blocks', () => {
      ruleTester.run('compact-try-catch', rule, {
        valid: [
          'try {\n  a();\n  b();\n}\ncatch (e) { c(); }',
          'try { a(); } catch (e) {\n  b();\n  c();\n}\nfinally { d(); }'
        ],
        invalid: [
          {
            code: 'try {\n  a();\n  b();\n}\ncatch (e) {\n  c();\n  d();\n}',
            output: 'try {\n  a();\n  b();\n} catch (e) {\n  c();\n  d();\n}',
            errors: [{messageId: 'compactCatch'}]
          },
          {
            code: 'try { a(); } catch (e) {\n  b();\n  c();\n}\nfinally {\n  d();\n  e();\n}',
            output: 'try { a(); } catch (e) {\n  b();\n  c();\n} finally {\n  d();\n  e();\n}',
            errors: [{messageId: 'compactFinally'}]
          }
        ]
      })
    })

    it('should compress try and enforce } catch on same line when try becomes single-line', () => {
      ruleTester.run('compact-try-catch', rule, {
        valid: [],
        invalid: [
          {
            code: 'try {\n  foo();\n}\ncatch (e) { bar(); }',
            output: 'try { foo(); }\ncatch (e) { bar(); }',
            errors: [{messageId: 'preferSingleLineTry'}]
          }
        ]
      })
    })
  })

  describe('edge cases', () => {
    it('should handle empty blocks', () => {
      ruleTester.run('compact-try-catch', rule, {
        valid: [
          'try {} catch (e) {}',
          'try { foo(); } catch (e) {}'
        ],
        invalid: []
      })
    })

    it('should not compress blocks with complex statements', () => {
      ruleTester.run('compact-try-catch', rule, {
        valid: [
          'try {\n  if (x) { y(); }\n} catch (e) { bar(); }',
          'try { foo(); } catch (e) {\n  if (x) { y(); }\n}'
        ],
        invalid: []
      })
    })

    it('should not compress blocks exceeding max length', () => {
      ruleTester.run('compact-try-catch', rule, {
        valid: [
          `try {\n  veryLongFunctionNameThatExceedsTheMaximumLineLengthWhenCompressedToSingleLineWithAllItsParametersAndEverything();\n} catch (e) { bar(); }`
        ],
        invalid: []
      })
    })
  })
})

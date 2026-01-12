import {RuleTester} from 'eslint'
import * as tseslint from 'typescript-eslint'
import {describe, it} from 'vitest'
import rule from './call'

/**
 * Test suite for prefer-single-line-call rule
 *
 * This rule compresses multi-line function calls to single line when the result
 * fits within the maximum line length.
 *
 * messageIds tested:
 * - preferSingleLineCall: Reports when a function call can be written on a single line
 *
 * Schema options tested:
 * - maxLineLength: Maximum line length for the single-line form (default: 160)
 */
const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parser: tseslint.parser,
  },
})

describe('prefer-single-line-call', () => {
  describe('valid cases', () => {
    describe('skip scenarios - function arguments (Requirements 3.3, 3.4)', () => {
      it('should skip calls with arrow function arguments', () => {
        ruleTester.run('prefer-single-line-call', rule, {
          valid: [
            // 箭头函数参数 - 不应简化 (Requirement 3.3)
            `arr.map(
  x => x * 2
)`,
            `arr.filter(
  item => item.active
)`,
            `setTimeout(
  () => console.log('done'),
  1000
)`,
          ],
          invalid: [],
        })
      })

      it('should skip calls with function expression arguments', () => {
        ruleTester.run('prefer-single-line-call', rule, {
          valid: [
            // 函数表达式参数 - 不应简化 (Requirement 3.4)
            `arr.map(
  function(x) { return x * 2 }
)`,
            `addEventListener(
  'click',
  function() { console.log('clicked') }
)`,
          ],
          invalid: [],
        })
      })
    })

    describe('skip scenarios - template literals (Requirement 3.5)', () => {
      it('should skip calls with multi-line template literals', () => {
        ruleTester.run('prefer-single-line-call', rule, {
          valid: [
            // 多行模板字面量 - 不应简化 (Requirement 3.5)
            "console.log(\n  `line1\nline2`\n)",
            "sql(\n  `SELECT *\n   FROM users`\n)",
          ],
          invalid: [],
        })
      })
    })

    describe('skip scenarios - large objects/arrays (Requirements 3.6, 3.7)', () => {
      it('should skip calls with objects having 5+ properties', () => {
        ruleTester.run('prefer-single-line-call', rule, {
          valid: [
            // 5个及以上属性的对象 - 不应简化 (Requirement 3.6)
            `createUser(
  {a: 1, b: 2, c: 3, d: 4, e: 5}
)`,
            `config(
  {name: 'test', age: 20, city: 'NYC', country: 'USA', zip: '10001'}
)`,
          ],
          invalid: [],
        })
      })

      it('should skip calls with arrays having 4+ elements', () => {
        ruleTester.run('prefer-single-line-call', rule, {
          valid: [
            // 4个及以上元素的数组 - 不应简化 (Requirement 3.7)
            `process(
  [1, 2, 3, 4]
)`,
            `concat(
  ['a', 'b', 'c', 'd', 'e']
)`,
          ],
          invalid: [],
        })
      })
    })

    describe('skip scenarios - nested objects (Requirement 3.8)', () => {
      it('should skip calls with nested object literals', () => {
        ruleTester.run('prefer-single-line-call', rule, {
          valid: [
            // 嵌套对象字面量 - 不应简化 (Requirement 3.8)
            `createConfig(
  {outer: {inner: 1}}
)`,
            `setup(
  {data: {items: []}}
)`,
          ],
          invalid: [],
        })
      })
    })

    describe('skip scenarios - exceeds length (Requirement 3.9)', () => {
      it('should skip when single-line form exceeds maxLineLength', () => {
        ruleTester.run('prefer-single-line-call', rule, {
          valid: [
            // 超过最大行长度 - 不应简化 (Requirement 3.9)
            `veryLongFunctionNameThatExceedsTheMaximumLineLengthWhenCombinedWithTheRestOfTheExpression(
  'anotherVeryLongStringArgumentThatMakesTheLineTooLongToFitOnASingleLineEvenWithoutIndentation',
  'andYetAnotherLongArgument'
)`,
          ],
          invalid: [],
        })
      })
    })

    describe('skip scenarios - chained calls (Requirements 3.10, 3.11)', () => {
      it('should skip calls that are part of a chained call', () => {
        ruleTester.run('prefer-single-line-call', rule, {
          valid: [
            // 链式调用的一部分 - 不应简化 (Requirement 3.10)
            `app.get(
  '/api'
).post(
  '/data'
)`,
          ],
          invalid: [],
        })
      })

      it('should skip chained method calls', () => {
        ruleTester.run('prefer-single-line-call', rule, {
          valid: [
            // 链式方法调用 - 不应简化 (Requirement 3.11)
            `str.replaceAll(
  'a',
  'b'
).replaceAll(
  'c',
  'd'
)`,
          ],
          invalid: [],
        })
      })
    })

    describe('skip scenarios - comments (Requirement 3.12)', () => {
      it('should skip calls with comments', () => {
        ruleTester.run('prefer-single-line-call', rule, {
          valid: [
            // 有注释的调用 - 不应简化 (Requirement 3.12)
            `doSomething(
  // comment
  arg1
)`,
            `doSomething(
  arg1 /* inline comment */
)`,
          ],
          invalid: [],
        })
      })
    })

    describe('skip scenarios - already single-line (Requirement 3.13)', () => {
      it('should skip already single-line calls', () => {
        ruleTester.run('prefer-single-line-call', rule, {
          valid: [
            // 已经是单行的 - 不应报告 (Requirement 3.13)
            'doSomething(arg1, arg2)',
            'console.log("hello")',
            'Math.max(1, 2, 3)',
          ],
          invalid: [],
        })
      })
    })
  })

  describe('invalid cases', () => {
    describe('basic transformations (Requirements 3.1, 3.2)', () => {
      it('should compress multi-line calls to single line', () => {
        ruleTester.run('prefer-single-line-call', rule, {
          valid: [],
          invalid: [
            // 多行调用压缩 - 应该简化 (Requirement 3.1)
            {
              code: `doSomething(
  arg1,
  arg2
)`,
              output: 'doSomething(arg1, arg2)',
              errors: [{messageId: 'preferSingleLineCall'}],
            },
            // 方法调用
            {
              code: `this.connection.send(
  JSON.stringify({type: 'shutdown'})
)`,
              output: "this.connection.send(JSON.stringify({type: 'shutdown'}))",
              errors: [{messageId: 'preferSingleLineCall'}],
            },
            // 简单对象参数
            {
              code: `createUser(
  {name: 'test'}
)`,
              output: "createUser({name: 'test'})",
              errors: [{messageId: 'preferSingleLineCall'}],
            },
          ],
        })
      })

      it('should remove trailing comma', () => {
        ruleTester.run('prefer-single-line-call', rule, {
          valid: [],
          invalid: [
            // 尾逗号移除 - 应该简化 (Requirement 3.2)
            {
              code: `doSomething(
  arg1,
  arg2,
)`,
              output: 'doSomething(arg1, arg2)',
              errors: [{messageId: 'preferSingleLineCall'}],
            },
            // 单参数带尾逗号
            {
              code: `console.log(
  'hello',
)`,
              output: "console.log('hello')",
              errors: [{messageId: 'preferSingleLineCall'}],
            },
          ],
        })
      })
    })
  })

  // ==================== Schema Options Tests (Requirement 7.3) ====================
  describe('schema options', () => {
    describe('maxLineLength option', () => {
      it('should respect custom maxLineLength value', () => {
        ruleTester.run('prefer-single-line-call', rule, {
          valid: [
            // With maxLineLength=30, this call would exceed the limit and should NOT be simplified
            // "doSomething('argument1', 'argument2')" is 38 chars, exceeds 30
            {
              code: `doSomething(
  'argument1',
  'argument2'
)`,
              options: [{maxLineLength: 30}],
            },
          ],
          invalid: [
            // With maxLineLength=100, this call fits and SHOULD be simplified
            {
              code: `doSomething(
  'arg1',
  'arg2'
)`,
              output: "doSomething('arg1', 'arg2')",
              options: [{maxLineLength: 100}],
              errors: [{messageId: 'preferSingleLineCall'}],
            },
          ],
        })
      })

      it('should work with very short maxLineLength', () => {
        ruleTester.run('prefer-single-line-call', rule, {
          valid: [
            // With maxLineLength=5, even short calls should NOT be simplified
            // "fn('a')" is 7 chars, exceeds 5
            {
              code: `fn(
  'a'
)`,
              options: [{maxLineLength: 5}],
            },
          ],
          invalid: [],
        })
      })

      it('should work with very long maxLineLength', () => {
        ruleTester.run('prefer-single-line-call', rule, {
          valid: [],
          invalid: [
            // With maxLineLength=300, longer calls SHOULD be simplified
            {
              code: `someFunctionWithALongerName(
  'firstArgument',
  'secondArgument',
  'thirdArgument'
)`,
              output: "someFunctionWithALongerName('firstArgument', 'secondArgument', 'thirdArgument')",
              options: [{maxLineLength: 300}],
              errors: [{messageId: 'preferSingleLineCall'}],
            },
          ],
        })
      })
    })
  })
})

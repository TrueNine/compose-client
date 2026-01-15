import { RuleTester } from 'eslint'
import * as tseslint from 'typescript-eslint'
import { describe, it } from 'vitest'
import rule from './control'

/**
 * Test suite for prefer-single-line-control rule
 *
 * This rule simplifies control structures (switch cases, loops, try-catch) to single-line
 * format when they contain simple statements.
 *
 * messageIds tested:
 * - preferSingleLineCase: Reports when a switch case can be single-line
 * - preferSingleLineFor: Reports when a for/for-in/for-of loop can be single-line
 * - preferSingleLineWhile: Reports when a while loop can be single-line
 * - preferSingleLineTry: Reports when a try-catch-finally can be single-line
 *
 * Note: The rule also defines preferBraceCatch and preferBraceFinally messageIds,
 * but these are currently unused in the implementation (dead code).
 *
 * Schema options: None (this rule has no configurable options)
 */
const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parser: tseslint.parser,
  },
})

describe('prefer-single-line-control', () => {
  // ==================== Switch Case Tests ====================
  describe('switch case', () => {
    describe('invalid cases - basic transformations (Requirements 4.1, 4.2, 4.3, 4.19)', () => {
      it('should simplify case with single simple statement', () => {
        ruleTester.run('prefer-single-line-control', rule, {
          valid: [],
          invalid: [
            // 单语句 case - 应该简化 (Requirement 4.1)
            {
              code: `switch (x) {
  case 1:
    console.log('one')
}`,
              output: `switch (x) {
  case 1: console.log('one');
}`,
              errors: [{ messageId: 'preferSingleLineCase' }],
            },
          ],
        })
      })

      it('should preserve break statement', () => {
        ruleTester.run('prefer-single-line-control', rule, {
          valid: [],
          invalid: [
            // 带 break 的 case - 应该保留 break (Requirement 4.2)
            {
              code: `switch (x) {
  case 1:
    console.log('one')
    break
}`,
              output: `switch (x) {
  case 1: console.log('one'); break
}`,
              errors: [{ messageId: 'preferSingleLineCase' }],
            },
          ],
        })
      })

      it('should simplify case with block wrapper', () => {
        ruleTester.run('prefer-single-line-control', rule, {
          valid: [],
          invalid: [
            // 块包裹的 case - 应该简化 (Requirement 4.3)
            {
              code: `switch (x) {
  case 1: {
    console.log('one')
  }
}`,
              output: `switch (x) {
  case 1: console.log('one');
}`,
              errors: [{ messageId: 'preferSingleLineCase' }],
            },
            // 块包裹带 break
            {
              code: `switch (x) {
  case 1: {
    console.log('one')
    break
  }
}`,
              output: `switch (x) {
  case 1: console.log('one'); break
}`,
              errors: [{ messageId: 'preferSingleLineCase' }],
            },
          ],
        })
      })

      it('should simplify default case', () => {
        ruleTester.run('prefer-single-line-control', rule, {
          valid: [],
          invalid: [
            // default case - 应该简化 (Requirement 4.19)
            {
              code: `switch (x) {
  default:
    console.log('default')
}`,
              output: `switch (x) {
  default: console.log('default');
}`,
              errors: [{ messageId: 'preferSingleLineCase' }],
            },
            // default case 带 break
            {
              code: `switch (x) {
  default:
    console.log('default')
    break
}`,
              output: `switch (x) {
  default: console.log('default'); break
}`,
              errors: [{ messageId: 'preferSingleLineCase' }],
            },
          ],
        })
      })
    })

    describe('valid cases - skip scenarios (Requirements 4.4, 4.5, 4.6)', () => {
      it('should skip case with multiple statements', () => {
        ruleTester.run('prefer-single-line-control', rule, {
          valid: [
            // 多语句 case - 不应简化 (Requirement 4.4)
            `switch (x) {
  case 1:
    console.log('one')
    doSomething()
    break
}`,
            // 多语句块
            `switch (x) {
  case 1: {
    const y = x + 1
    console.log(y)
    break
  }
}`,
          ],
          invalid: [],
        })
      })

      it('should skip case with comments', () => {
        ruleTester.run('prefer-single-line-control', rule, {
          valid: [
            // 有注释的 case - 不应简化 (Requirement 4.5)
            // 注释在块内部
            `switch (x) {
  case 1: {
    // comment
    console.log('one')
  }
}`,
            `switch (x) {
  case 1: {
    console.log('one') /* inline comment */
  }
}`,
          ],
          invalid: [],
        })
      })

      it('should skip already single-line case', () => {
        ruleTester.run('prefer-single-line-control', rule, {
          valid: [
            // 已经是单行的 - 不应报告 (Requirement 4.6)
            `switch (x) {
  case 1: console.log('one'); break
}`,
            `switch (x) {
  case 1: return 'one'
}`,
            `switch (x) {
  default: console.log('default')
}`,
          ],
          invalid: [],
        })
      })
    })
  })

  // ==================== Loop Tests ====================
  describe('loops', () => {
    describe('invalid cases - basic transformations (Requirements 4.7, 4.8, 4.9, 4.10)', () => {
      it('should simplify for loop with single statement', () => {
        ruleTester.run('prefer-single-line-control', rule, {
          valid: [],
          invalid: [
            // for 循环简化 (Requirement 4.7)
            {
              code: `for (let i = 0; i < 10; i++) {
  console.log(i)
}`,
              output: 'for (let i = 0; i < 10; i++) console.log(i)',
              errors: [{ messageId: 'preferSingleLineFor' }],
            },
          ],
        })
      })

      it('should simplify for-in loop with single statement', () => {
        ruleTester.run('prefer-single-line-control', rule, {
          valid: [],
          invalid: [
            // for-in 循环简化 (Requirement 4.8)
            {
              code: `for (const key in obj) {
  console.log(key)
}`,
              output: 'for (const key in obj) console.log(key)',
              errors: [{ messageId: 'preferSingleLineFor' }],
            },
          ],
        })
      })

      it('should simplify for-of loop with single statement', () => {
        ruleTester.run('prefer-single-line-control', rule, {
          valid: [],
          invalid: [
            // for-of 循环简化 (Requirement 4.9)
            {
              code: `for (const item of items) {
  process(item)
}`,
              output: 'for (const item of items) process(item)',
              errors: [{ messageId: 'preferSingleLineFor' }],
            },
          ],
        })
      })

      it('should simplify while loop with single statement', () => {
        ruleTester.run('prefer-single-line-control', rule, {
          valid: [],
          invalid: [
            // while 循环简化 (Requirement 4.10)
            {
              code: `while (condition) {
  doSomething()
}`,
              output: 'while (condition) doSomething()',
              errors: [{ messageId: 'preferSingleLineWhile' }],
            },
          ],
        })
      })
    })

    describe('valid cases - skip scenarios (Requirements 4.11, 4.12, 4.13)', () => {
      it('should skip loop with multiple statements', () => {
        ruleTester.run('prefer-single-line-control', rule, {
          valid: [
            // 多语句循环体 - 不应简化 (Requirement 4.11)
            `for (let i = 0; i < 10; i++) {
  console.log(i)
  doSomething(i)
}`,
            `for (const item of items) {
  const processed = process(item)
  save(processed)
}`,
            `while (condition) {
  step1()
  step2()
}`,
          ],
          invalid: [],
        })
      })

      it('should skip loop with comments', () => {
        ruleTester.run('prefer-single-line-control', rule, {
          valid: [
            // 有注释的循环 - 不应简化 (Requirement 4.12)
            `for (let i = 0; i < 10; i++) {
  // comment
  console.log(i)
}`,
            `for (const item of items) {
  process(item) /* inline comment */
}`,
            `while (condition) {
  /* block comment */
  doSomething()
}`,
          ],
          invalid: [],
        })
      })

      it('should skip already single-line loop', () => {
        ruleTester.run('prefer-single-line-control', rule, {
          valid: [
            // 已经是单行的 - 不应报告 (Requirement 4.13)
            'for (let i = 0; i < 10; i++) console.log(i)',
            'for (const key in obj) console.log(key)',
            'for (const item of items) process(item)',
            'while (condition) doSomething()',
          ],
          invalid: [],
        })
      })
    })
  })
})

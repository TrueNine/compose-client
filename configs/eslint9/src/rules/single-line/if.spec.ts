import {RuleTester} from 'eslint'
import * as tseslint from 'typescript-eslint'
import {describe, it} from 'vitest'
import rule from './if'

/**
 * Test suite for prefer-single-line-if rule
 *
 * This rule simplifies if statements and if-else chains to single-line format
 * when they contain simple statements.
 *
 * messageIds tested:
 * - preferSingleLine: Reports when an entire if-else chain can be single-line
 * - preferSingleLineBranch: Reports when individual branches can be simplified
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

describe('prefer-single-line-if', () => {
  describe('invalid cases', () => {
    describe('basic transformations (Requirements 5.1, 5.2, 5.3)', () => {
      it('should simplify single if statement', () => {
        ruleTester.run('prefer-single-line-if', rule, {
          valid: [],
          invalid: [
            { // 单 if 语句 - 应该简化 (Requirement 5.1)
              code: `if (condition) {
  return value
}`,
              output: 'if (condition) return value',
              errors: [{messageId: 'preferSingleLine'}],
            },
            { // 单 if 语句 - 表达式语句
              code: `if (condition) {
  doSomething()
}`,
              output: 'if (condition) doSomething()',
              errors: [{messageId: 'preferSingleLine'}],
            },
          ],
        })
      })

      it('should simplify if-else chain', () => {
        ruleTester.run('prefer-single-line-if', rule, {
          valid: [],
          invalid: [
            { // if-else 链 - 应该简化 (Requirement 5.2)
              code: `if (condition) {
  return 'yes'
} else {
  return 'no'
}`,
              output: `if (condition) return 'yes'
else return 'no'`,
              errors: [{messageId: 'preferSingleLine'}],
            },
          ],
        })
      })

      it('should simplify if-else-if-else chain', () => {
        ruleTester.run('prefer-single-line-if', rule, {
          valid: [],
          invalid: [
            { // if-else-if-else 链 - 应该简化 (Requirement 5.3)
              code: `if (a) {
  return 1
} else if (b) {
  return 2
} else {
  return 3
}`,
              output: `if (a) return 1
else if (b) return 2
else return 3`,
              errors: [{messageId: 'preferSingleLine'}],
            },
          ],
        })
      })
    })

    describe('special handling (Requirements 5.4, 5.10)', () => {
      it('should normalize multi-line condition to single line', () => {
        ruleTester.run('prefer-single-line-if', rule, {
          valid: [],
          invalid: [
            { // 多行条件 - 应该压缩成单行 (Requirement 5.4)
              code: `if (condition1
  || condition2) {
  return value
}`,
              output: 'if (condition1 || condition2) return value',
              errors: [{messageId: 'preferSingleLine'}],
            },
            { // 多行条件 - && 分隔
              code: `if (condition1
  && condition2) {
  return value
}`,
              output: 'if (condition1 && condition2) return value',
              errors: [{messageId: 'preferSingleLine'}],
            },
          ],
        })
      })

      it('should simplify only simplifiable branches', () => {
        ruleTester.run('prefer-single-line-if', rule, {
          valid: [],
          invalid: [
            { // 部分简化 - 只简化可简化的分支 (Requirement 5.10)
              code: `if (a) {
  return 1
} else {
  const x = 2
  return x
}`,
              output: `if (a) return 1
else {
  const x = 2
  return x
}`,
              errors: [{messageId: 'preferSingleLineBranch'}],
            },
          ],
        })
      })
    })
  })

  describe('valid cases', () => {
    describe('skip scenarios (Requirements 5.5, 5.6, 5.7, 5.8)', () => {
      it('should skip if branch with complex statement', () => {
        ruleTester.run('prefer-single-line-if', rule, {
          valid: [
            `if (condition) { // 复杂语句 - 不应简化 (Requirement 5.5)
  const x = getValue()
  return x
}`,
            `if (condition) { // 多语句块
  doSomething()
  doMore()
}`,
            `if (condition) { // for 循环 (not a simple statement)
  for (const item of items) {
    process(item)
  }
}`,
          ],
          invalid: [],
        })
      })

      it('should skip if branch with comments', () => {
        ruleTester.run('prefer-single-line-if', rule, {
          valid: [
            `if (condition) { // 有注释 - 不应简化 (Requirement 5.6)
  // comment
  return value
}`,
            `if (condition) { // 块注释
  /* block comment */
  return value
}`,
            `if (condition) { // 行尾注释
  return value // trailing comment
}`,
          ],
          invalid: [],
        })
      })

      it('should skip already single-line if statement', () => {
        ruleTester.run('prefer-single-line-if', rule, {
          valid: [
            'if (condition) return value', // 已经是单行的 - 不应报告 (Requirement 5.7)
            'if (a) return 1; else return 2',
            'if (a) doSomething()',
          ],
          invalid: [],
        })
      })

      it('should skip when single-line form exceeds MAX_LINE_LENGTH', () => {
        ruleTester.run('prefer-single-line-if', rule, {
          valid: [
            `if (veryLongConditionNameThatExceedsTheMaximumLineLengthWhenCombinedWithTheRestOfTheExpressionAndMoreTextToMakeItLonger) { // 超长度 - 不应简化 (Requirement 5.8)
  return veryLongReturnValueThatAlsoExceedsTheMaximumLineLengthWhenCombinedWithTheCondition
}`,
          ],
          invalid: [],
        })
      })
    })

    describe('chain handling (Requirement 5.9)', () => {
      it('should not report else-if chain nodes separately', () => {
        ruleTester.run('prefer-single-line-if', rule, {
          valid: [
            `if (a) return 1 // 整个链会作为一个整体处理 // 这个测试验证规则不会对 else-if 链中的子节点单独报告 // else-if 链中的非根节点 - 不应单独报告 (Requirement 5.9)
else if (b) {
  const x = 2
  return x
}`,
          ],
          invalid: [],
        })
      })
    })
  })

  describe('simple statement recognition (Requirement 5.11)', () => {
    it('should recognize return as simple statement', () => {
      ruleTester.run('prefer-single-line-if', rule, {
        valid: [],
        invalid: [
          {
            code: `if (condition) {
  return value
}`,
            output: 'if (condition) return value',
            errors: [{messageId: 'preferSingleLine'}],
          },
        ],
      })
    })

    it('should recognize throw as simple statement', () => {
      ruleTester.run('prefer-single-line-if', rule, {
        valid: [],
        invalid: [
          {
            code: `if (condition) {
  throw new Error('error')
}`,
            output: `if (condition) throw new Error('error')`,
            errors: [{messageId: 'preferSingleLine'}],
          },
        ],
      })
    })

    it('should recognize break as simple statement', () => {
      ruleTester.run('prefer-single-line-if', rule, {
        valid: [],
        invalid: [
          {
            code: `for (const item of items) {
  if (condition) {
    break
  }
}`,
            output: `for (const item of items) {
  if (condition) break
}`,
            errors: [{messageId: 'preferSingleLine'}],
          },
        ],
      })
    })

    it('should recognize continue as simple statement', () => {
      ruleTester.run('prefer-single-line-if', rule, {
        valid: [],
        invalid: [
          {
            code: `for (const item of items) {
  if (condition) {
    continue
  }
}`,
            output: `for (const item of items) {
  if (condition) continue
}`,
            errors: [{messageId: 'preferSingleLine'}],
          },
        ],
      })
    })

    it('should recognize expression statement as simple statement', () => {
      ruleTester.run('prefer-single-line-if', rule, {
        valid: [],
        invalid: [
          {
            code: `if (condition) {
  doSomething()
}`,
            output: 'if (condition) doSomething()',
            errors: [{messageId: 'preferSingleLine'}],
          },
        ],
      })
    })
  })
})

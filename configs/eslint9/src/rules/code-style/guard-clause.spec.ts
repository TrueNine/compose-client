import {RuleTester} from 'eslint'
import * as tseslint from 'typescript-eslint'
import {describe, it} from 'vitest'
import rule from './guard-clause'

/**
 * Test suite for prefer-guard-clause rule
 *
 * This rule transforms nested if statements into guard clauses (early returns)
 * to reduce code nesting and improve readability.
 *
 * messageIds tested:
 * - preferGuardClause: Reports when an if statement can be converted to a guard clause
 *
 * Schema options tested:
 * - minStatements: Minimum number of statements in the if block to trigger the rule (default: 2)
 */
const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parser: tseslint.parser
  }
})

describe('prefer-guard-clause', () => {
  describe('valid cases', () => {
    describe('skip scenarios (Requirements 2.8, 2.9, 2.10)', () => {
      it('should skip if statement with else branch', () => {
        ruleTester.run('prefer-guard-clause', rule, {
          valid: [
            `function process(data) { // 有 else 分支 - 不应转换 (Requirement 2.8)
  if (data) {
    doSomething(data)
    doMore(data)
  } else {
    handleEmpty()
  }
}`,
            `function process(data) { // if-else-if 链
  if (data.type === 'a') {
    handleA(data)
    processA(data)
  } else if (data.type === 'b') {
    handleB(data)
  }
}`
          ],
          invalid: []
        })
      })

      it('should skip if block with fewer statements than minStatements', () => {
        ruleTester.run('prefer-guard-clause', rule, {
          valid: [
            `function process(data) { // 语句数不足 - 默认 minStatements=2 (Requirement 2.9)
  if (data) {
    doSomething(data)
  }
}`
          ],
          invalid: []
        })
      })

      it('should skip if statement not in function body', () => {
        ruleTester.run('prefer-guard-clause', rule, {
          valid: [
            `if (condition) { // 非函数体 - 不应转换 (Requirement 2.10)
  doSomething()
  doMore()
}`,
            `const x = 1 // 在模块顶层
if (x > 0) {
  console.log('positive')
  console.log('done')
}`
          ],
          invalid: []
        })
      })
    })
  })

  describe('invalid cases', () => {
    describe('basic transformations (Requirements 2.1, 2.2)', () => {
      it('should transform if block wrapping entire function body', () => {
        ruleTester.run('prefer-guard-clause', rule, {
          valid: [],
          invalid: [
            { // if 块包裹整个函数体 (Requirement 2.1)
              code: `function process(data) {
  if (data) {
    doSomething(data)
    doMore(data)
  }
}`,
              output: `function process(data) {
  if (!data) return

  doSomething(data)
  doMore(data)
}`,
              errors: [{messageId: 'preferGuardClause'}]
            }
          ]
        })
      })

      it('should transform if block followed by single return', () => {
        ruleTester.run('prefer-guard-clause', rule, {
          valid: [],
          invalid: [
            { // if 块后跟单个 return (Requirement 2.2)
              code: `function process(data) {
  if (data) {
    doSomething(data)
    doMore(data)
  }
  return null
}`,
              output: `function process(data) {
  if (!data) return null

  doSomething(data)
  doMore(data)
  return null
}`,
              errors: [{messageId: 'preferGuardClause'}]
            }
          ]
        })
      })
    })

    describe('condition inversion (Requirements 2.3, 2.4, 2.5, 2.6, 2.7)', () => {
      it('should invert equality operators', () => {
        ruleTester.run('prefer-guard-clause', rule, {
          valid: [],
          invalid: [
            {
              code: `function process(data) {
  if (data === 'valid') {
    doSomething(data)
    doMore(data)
  }
}`,
              output: `function process(data) {
  if (data !== 'valid') return

  doSomething(data)
  doMore(data)
}`,
              errors: [{messageId: 'preferGuardClause'}]
            },
            {
              code: `function process(data) {
  if (data !== null) {
    doSomething(data)
    doMore(data)
  }
}`,
              output: `function process(data) {
  if (data === null) return

  doSomething(data)
  doMore(data)
}`,
              errors: [{messageId: 'preferGuardClause'}]
            },
            { // == 转换为 !=
              code: `function process(data) {
  if (data == 'valid') {
    doSomething(data)
    doMore(data)
  }
}`,
              output: `function process(data) {
  if (data != 'valid') return

  doSomething(data)
  doMore(data)
}`,
              errors: [{messageId: 'preferGuardClause'}]
            },
            { // != 转换为 ==
              code: `function process(data) {
  if (data != null) {
    doSomething(data)
    doMore(data)
  }
}`,
              output: `function process(data) {
  if (data == null) return

  doSomething(data)
  doMore(data)
}`,
              errors: [{messageId: 'preferGuardClause'}]
            }
          ]
        })
      })

      it('should invert comparison operators', () => {
        ruleTester.run('prefer-guard-clause', rule, {
          valid: [],
          invalid: [
            { // > 转换为 <= (Requirement 2.4)
              code: `function process(data) {
  if (data > 0) {
    doSomething(data)
    doMore(data)
  }
}`,
              output: `function process(data) {
  if (data <= 0) return

  doSomething(data)
  doMore(data)
}`,
              errors: [{messageId: 'preferGuardClause'}]
            },
            { // < 转换为 >=
              code: `function process(data) {
  if (data < 10) {
    doSomething(data)
    doMore(data)
  }
}`,
              output: `function process(data) {
  if (data >= 10) return

  doSomething(data)
  doMore(data)
}`,
              errors: [{messageId: 'preferGuardClause'}]
            },
            { // >= 转换为 <
              code: `function process(data) {
  if (data >= 0) {
    doSomething(data)
    doMore(data)
  }
}`,
              output: `function process(data) {
  if (data < 0) return

  doSomething(data)
  doMore(data)
}`,
              errors: [{messageId: 'preferGuardClause'}]
            },
            { // <= 转换为 >
              code: `function process(data) {
  if (data <= 10) {
    doSomething(data)
    doMore(data)
  }
}`,
              output: `function process(data) {
  if (data > 10) return

  doSomething(data)
  doMore(data)
}`,
              errors: [{messageId: 'preferGuardClause'}]
            }
          ]
        })
      })

      it('should remove negation', () => {
        ruleTester.run('prefer-guard-clause', rule, {
          valid: [],
          invalid: [
            { // !condition 转换为 condition (Requirement 2.5)
              code: `function process(data) {
  if (!isEmpty) {
    doSomething(data)
    doMore(data)
  }
}`,
              output: `function process(data) {
  if (isEmpty) return

  doSomething(data)
  doMore(data)
}`,
              errors: [{messageId: 'preferGuardClause'}]
            },
            { // !(expr) 转换为 expr
              code: `function process(data) {
  if (!(data.valid)) {
    doSomething(data)
    doMore(data)
  }
}`,
              output: `function process(data) {
  if (data.valid) return

  doSomething(data)
  doMore(data)
}`,
              errors: [{messageId: 'preferGuardClause'}]
            }
          ]
        })
      })

      it('should wrap logical operators in negation', () => {
        ruleTester.run('prefer-guard-clause', rule, {
          valid: [],
          invalid: [
            { // && 表达式包裹在 !() 中 (Requirement 2.6)
              code: `function process(data) {
  if (data && data.valid) {
    doSomething(data)
    doMore(data)
  }
}`,
              output: `function process(data) {
  if (!(data && data.valid)) return

  doSomething(data)
  doMore(data)
}`,
              errors: [{messageId: 'preferGuardClause'}]
            },
            { // || 表达式包裹在 !() 中
              code: `function process(data) {
  if (data || fallback) {
    doSomething(data)
    doMore(data)
  }
}`,
              output: `function process(data) {
  if (!(data || fallback)) return

  doSomething(data)
  doMore(data)
}`,
              errors: [{messageId: 'preferGuardClause'}]
            }
          ]
        })
      })

      it('should invert .length checks', () => {
        ruleTester.run('prefer-guard-clause', rule, {
          valid: [],
          invalid: [
            {
              code: `function process(data) {
  if (data.length > 0) {
    doSomething(data)
    doMore(data)
  }
}`,
              output: `function process(data) {
  if (data.length <= 0) return

  doSomething(data)
  doMore(data)
}`,
              errors: [{messageId: 'preferGuardClause'}]
            },
            {
              code: `function process(data) {
  if (data.length === 0) {
    handleEmpty()
    logEmpty()
  }
}`,
              output: `function process(data) {
  if (data.length !== 0) return

  handleEmpty()
  logEmpty()
}`,
              errors: [{messageId: 'preferGuardClause'}]
            }
          ]
        })
      })
    })

    describe('special handling (Requirements 2.11, 2.12)', () => {
      it('should handle if block ending with return', () => {
        ruleTester.run('prefer-guard-clause', rule, {
          valid: [],
          invalid: [
            { // 块末有 return - 规则会移除最后的 return 并将其放入 guard clause (Requirement 2.11)
              code: `function process(data) {
  if (data) {
    doSomething(data)
    return 'done'
  }
}`,
              output: `function process(data) {
  if (!data) return

  doSomething(data)
}`,
              errors: [{messageId: 'preferGuardClause'}]
            },
            { // 块末有 return 且后跟 return
              code: `function process(data) {
  if (data) {
    doSomething(data)
    return 'success'
  }
  return 'failure'
}`,
              output: `function process(data) {
  if (!data) return 'failure'

  doSomething(data)
  return 'success'
}`,
              errors: [{messageId: 'preferGuardClause'}]
            }
          ]
        })
      })

      it('should handle functions with non-void return type', () => {
        ruleTester.run('prefer-guard-clause', rule, {
          valid: [],
          invalid: [
            { // 非 void 返回类型，块末有 return (Requirement 2.12)
              code: `function process(data): string {
  if (data) {
    doSomething(data)
    return 'result'
  }
}`,
              output: `function process(data): string {
  if (!data) return 'result'

  doSomething(data)
}`,
              errors: [{messageId: 'preferGuardClause'}]
            }
          ]
        })
      })
    })
  })

  describe('schema options', () => {
    describe('minStatements option', () => {
      it('should respect custom minStatements value', () => {
        ruleTester.run('prefer-guard-clause', rule, {
          valid: [
            { // With minStatements=3, a block with 2 statements should NOT trigger the rule
              code: `function process(data) {
  if (data) {
    doSomething(data)
    doMore(data)
  }
}`,
              options: [{minStatements: 3}]
            }
          ],
          invalid: [
            { // With minStatements=3, a block with 3 statements SHOULD trigger the rule
              code: `function process(data) {
  if (data) {
    step1(data)
    step2(data)
    step3(data)
  }
}`,
              output: `function process(data) {
  if (!data) return

  step1(data)
  step2(data)
  step3(data)
}`,
              options: [{minStatements: 3}],
              errors: [{messageId: 'preferGuardClause'}]
            }
          ]
        })
      })

      it('should work with minStatements=1', () => {
        ruleTester.run('prefer-guard-clause', rule, {
          valid: [],
          invalid: [
            { // With minStatements=1, even a single statement block should trigger the rule
              code: `function process(data) {
  if (data) {
    doSomething(data)
  }
}`,
              output: `function process(data) {
  if (!data) return

  doSomething(data)
}`,
              options: [{minStatements: 1}],
              errors: [{messageId: 'preferGuardClause'}]
            }
          ]
        })
      })
    })
  })
})

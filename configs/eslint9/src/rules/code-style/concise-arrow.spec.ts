import {RuleTester} from 'eslint'
import * as tseslint from 'typescript-eslint'
import {describe, it} from 'vitest'
import rule from './concise-arrow'

/**
 * Test suite for prefer-concise-arrow rule
 *
 * This rule detects and fixes arrow functions that can be simplified from block body
 * to concise expression body.
 *
 * messageIds tested:
 * - preferConciseArrow: Reports when an arrow function body can be simplified to a single expression
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

describe('prefer-concise-arrow', () => {
  describe('valid cases', () => {
    describe('complex structures - should skip (Requirements 1.4, 1.5, 1.6)', () => {
      it('should skip nested arrow functions', () => {
        ruleTester.run('prefer-concise-arrow', rule, {
          valid: [
            `const handleToggle = (id: string) => { // 嵌套箭头函数 - 不应简化 (Requirement 1.4)
  setIds(prev =>
    prev.includes(id)
      ? prev.filter(x => x !== id)
      : [...prev, id]
  )
}`,
            `const fn = arr => { // 嵌套箭头函数在 return 语句中
  return arr.map(x => x * 2)
}`,
            `const fn = data => { // 深层嵌套箭头函数
  return data.filter(x => x > 0).map(y => y * 2)
}`,
            `const process = items => { // 嵌套箭头函数作为回调
  items.forEach(item => console.log(item))
}`,
            `const handler = (permissionId: string) => { // 复杂嵌套场景
  setSelectedPermissionIds(prev =>
    prev.includes(permissionId)
      ? prev.filter(id => id !== permissionId)
      : [...prev, permissionId]
  )
}`,
          ],
          invalid: [],
        })
      })

      it('should skip ternary expressions', () => {
        ruleTester.run('prefer-concise-arrow', rule, {
          valid: [
            `const fn = x => { // 三元表达式 - 不应简化 (Requirement 1.5)
  return x > 0 ? 'positive' : 'negative'
}`,
            `const fn = x => { // 嵌套三元表达式
  return x > 0 ? (x > 10 ? 'large' : 'small') : 'negative'
}`,
            `const fn = x => { // 三元表达式在表达式语句中
  result = x > 0 ? 'yes' : 'no'
}`,
          ],
          invalid: [],
        })
      })

      it('should skip logical expression chains', () => {
        ruleTester.run('prefer-concise-arrow', rule, {
          valid: [
            `const fn = x => { // 逻辑表达式链 - 不应简化 (Requirement 1.6)
  return x && y && z
}`,
            `const fn = x => { // 逻辑或表达式链
  return x || y || z
}`,
            `const fn = x => { // 混合逻辑表达式
  return (x && y) || z
}`,
            `const fn = x => { // 逻辑表达式在表达式语句中
  callback && callback(x)
}`,
          ],
          invalid: [],
        })
      })
    })

    describe('boundary conditions - should skip (Requirements 1.7, 1.8, 1.9, 1.10, 1.11)', () => {
      it('should skip arrow functions with comments', () => {
        ruleTester.run('prefer-concise-arrow', rule, {
          valid: [
            `const fn = x => { // 有注释的 - 不应简化 (Requirement 1.7)
  // comment
  return x + 1
}`,
            `const fn = x => { // 块注释
  /* block comment */
  return x + 1
}`,
            `const fn = x => { // 行尾注释
  return x + 1 // trailing comment
}`,
          ],
          invalid: [],
        })
      })

      it('should skip already single-line arrow functions', () => {
        ruleTester.run('prefer-concise-arrow', rule, {
          valid: [
            'const fn = x => { return x + 1 }', // 已经是单行的 - 不应报告 (Requirement 1.8)
            'const fn = x => { console.log(x) }',
            'const fn = (a, b) => { return a + b }',
          ],
          invalid: [],
        })
      })

      it('should skip multi-statement blocks', () => {
        ruleTester.run('prefer-concise-arrow', rule, {
          valid: [
            `const fn = x => { // 多语句块体 - 不应简化 (Requirement 1.9)
  const y = x + 1
  return y * 2
}`,
            `const fn = x => { // 多个表达式语句
  console.log(x)
  doSomething(x)
}`,
          ],
          invalid: [],
        })
      })

      it('should skip empty return statements', () => {
        ruleTester.run('prefer-concise-arrow', rule, {
          valid: [
            `const fn = x => { // 空 return - 不应简化 (Requirement 1.10)
  return
}`,
            `const fn = x => { // 空 return 带分号
  return;
}`,
          ],
          invalid: [],
        })
      })

      it('should skip when simplified form exceeds MAX_LINE_LENGTH', () => {
        ruleTester.run('prefer-concise-arrow', rule, {
          valid: [
            `const fn = x => { // MAX_LINE_LENGTH = 160, 这个简化后会超过 160 字符 // 超长度 - 不应简化 (Requirement 1.11)
  return veryLongFunctionNameThatExceedsTheMaximumLineLengthWhenCombinedWithTheRestOfTheExpressionAndMoreTextToMakeItLonger(x, anotherVeryLongParameterName, yetAnotherLongParameter)
}`,
          ],
          invalid: [],
        })
      })
    })

    describe('already concise form', () => {
      it('should not report already concise arrow functions', () => {
        ruleTester.run('prefer-concise-arrow', rule, {
          valid: [
            'const fn = x => x + 1', // 已经是简洁形式的箭头函数
            'const fn = (x, y) => x + y',
            'arr.forEach(it => console.log(it))',
            'const fn = async x => await fetch(x)',
          ],
          invalid: [],
        })
      })
    })
  })

  describe('invalid cases', () => {
    describe('basic transformations (Requirements 1.1, 1.2)', () => {
      it('should report and fix single expression statement', () => {
        ruleTester.run('prefer-concise-arrow', rule, {
          valid: [],
          invalid: [
            { // 单表达式语句 - 应该简化 (Requirement 1.1)
              code: `const fn = x => {
  console.log(x)
}`,
              output: 'const fn = x => console.log(x)',
              errors: [{messageId: 'preferConciseArrow'}],
            },
            { // forEach 中的简单调用
              code: `arr.forEach(it => {
  f.append(it.name, it.value)
})`,
              output: 'arr.forEach(it => f.append(it.name, it.value))',
              errors: [{messageId: 'preferConciseArrow'}],
            },
            { // 简单方法调用
              code: `const fn = item => {
  doSomething(item)
}`,
              output: 'const fn = item => doSomething(item)',
              errors: [{messageId: 'preferConciseArrow'}],
            },
          ],
        })
      })

      it('should report and fix single return statement', () => {
        ruleTester.run('prefer-concise-arrow', rule, {
          valid: [],
          invalid: [
            { // 单 return 语句 - 应该简化 (Requirement 1.2)
              code: `const fn = x => {
  return x + 1
}`,
              output: 'const fn = x => x + 1',
              errors: [{messageId: 'preferConciseArrow'}],
            },
            { // 返回函数调用
              code: `const fn = x => {
  return doSomething(x)
}`,
              output: 'const fn = x => doSomething(x)',
              errors: [{messageId: 'preferConciseArrow'}],
            },
            { // 返回数组
              code: `const fn = x => {
  return [x, x + 1]
}`,
              output: 'const fn = x => [x, x + 1]',
              errors: [{messageId: 'preferConciseArrow'}],
            },
          ],
        })
      })
    })

    describe('special handling (Requirements 1.3, 1.12, 1.13)', () => {
      it('should wrap object literal in parentheses', () => {
        ruleTester.run('prefer-concise-arrow', rule, {
          valid: [],
          invalid: [
            { // 返回对象字面量 - 应该加括号 (Requirement 1.3)
              code: `const fn = x => {
  return {value: x}
}`,
              output: 'const fn = x => ({value: x})',
              errors: [{messageId: 'preferConciseArrow'}],
            },
            { // 返回复杂对象字面量
              code: `const fn = x => {
  return {a: x, b: x + 1}
}`,
              output: 'const fn = x => ({a: x, b: x + 1})',
              errors: [{messageId: 'preferConciseArrow'}],
            },
            { // 返回空对象
              code: `const fn = x => {
  return {}
}`,
              output: 'const fn = x => ({})',
              errors: [{messageId: 'preferConciseArrow'}],
            },
          ],
        })
      })

      it('should preserve async keyword', () => {
        ruleTester.run('prefer-concise-arrow', rule, {
          valid: [],
          invalid: [
            { // async 函数 - 应该保留 async (Requirement 1.12)
              code: `const fn = async x => {
  return await fetch(x)
}`,
              output: 'const fn = async x => await fetch(x)',
              errors: [{messageId: 'preferConciseArrow'}],
            },
            { // async 表达式语句
              code: `const fn = async x => {
  await doSomething(x)
}`,
              output: 'const fn = async x => await doSomething(x)',
              errors: [{messageId: 'preferConciseArrow'}],
            },
          ],
        })
      })

      it('should preserve parentheses for multiple parameters', () => {
        ruleTester.run('prefer-concise-arrow', rule, {
          valid: [],
          invalid: [
            { // 多参数 - 应该保留括号 (Requirement 1.13)
              code: `const add = (a, b) => {
  return a + b
}`,
              output: 'const add = (a, b) => a + b',
              errors: [{messageId: 'preferConciseArrow'}],
            },
            { // 三个参数
              code: `const fn = (a, b, c) => {
  return a + b + c
}`,
              output: 'const fn = (a, b, c) => a + b + c',
              errors: [{messageId: 'preferConciseArrow'}],
            },
            { // 带类型注解的多参数
              code: `const fn = (a: number, b: number) => {
  return a + b
}`,
              output: 'const fn = (a: number, b: number) => a + b',
              errors: [{messageId: 'preferConciseArrow'}],
            },
            { // 解构参数
              code: `const fn = ({a, b}) => {
  return a + b
}`,
              output: 'const fn = ({a, b}) => a + b',
              errors: [{messageId: 'preferConciseArrow'}],
            },
            { // 数组解构参数
              code: `const fn = ([a, b]) => {
  return a + b
}`,
              output: 'const fn = ([a, b]) => a + b',
              errors: [{messageId: 'preferConciseArrow'}],
            },
          ],
        })
      })

      it('should preserve parentheses for single parameter with type annotation', () => {
        ruleTester.run('prefer-concise-arrow', rule, {
          valid: [],
          invalid: [
            { // 单参数带类型注解 - 应该保留括号 (TypeScript 要求)
              code: `const fn = (x: number) => {
  return x + 1
}`,
              output: 'const fn = (x: number) => x + 1',
              errors: [{messageId: 'preferConciseArrow'}],
            },
            { // useCallback 场景 - 单参数带类型注解
              code: `const handleDirtyChange = useCallback((dirty: boolean) => {
  isDirtyRef.current = dirty
}, [])`,
              output: 'const handleDirtyChange = useCallback((dirty: boolean) => isDirtyRef.current = dirty, [])',
              errors: [{messageId: 'preferConciseArrow'}],
            },
            { // 单参数带复杂类型注解
              code: `const fn = (item: {name: string}) => {
  console.log(item.name)
}`,
              output: 'const fn = (item: {name: string}) => console.log(item.name)',
              errors: [{messageId: 'preferConciseArrow'}],
            },
          ],
        })
      })
    })
  })
})

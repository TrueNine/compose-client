import {RuleTester} from 'eslint'
import * as tseslint from 'typescript-eslint'
import {describe, it} from 'vitest'
import rule from './concise-arrow'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parser: tseslint.parser,
  },
})

describe('prefer-concise-arrow', () => {
  it('should pass all test cases', () => {
    ruleTester.run('prefer-concise-arrow', rule, {
      valid: [
        // 已经是简洁形式的箭头函数
        'const fn = x => x + 1',
        'const fn = (x, y) => x + y',
        'arr.forEach(it => console.log(it))',

        // 已经是单行的块体箭头函数（不需要简化）
        'const fn = x => { return x + 1 }',

        // 包含嵌套箭头函数 - 不应简化（修复的核心场景）
        `const handleToggle = (id: string) => {
  setIds(prev =>
    prev.includes(id)
      ? prev.filter(x => x !== id)
      : [...prev, id]
  )
}`,

        // 包含三元表达式 - 不应简化
        `const fn = x => {
  return x > 0 ? 'positive' : 'negative'
}`,

        // 包含逻辑表达式链 - 不应简化
        `const fn = x => {
  return x && y && z
}`,

        // 包含嵌套箭头函数的 return 语句
        `const fn = arr => {
  return arr.map(x => x * 2)
}`,

        // 多语句块体 - 不应简化
        `const fn = x => {
  const y = x + 1
  return y * 2
}`,

        // 空 return - 不应简化
        `const fn = x => {
  return
}`,

        // 有注释的 - 不应简化
        `const fn = x => {
  // comment
  return x + 1
}`,

        // 复杂嵌套场景
        `const handler = (permissionId: string) => {
  setSelectedPermissionIds(prev =>
    prev.includes(permissionId)
      ? prev.filter(id => id !== permissionId)
      : [...prev, permissionId]
  )
}`,

        // 嵌套回调 - 外层包含嵌套箭头函数，不应简化
        `const process = data => {
  return data.map(item => item.value)
}`,
      ],

      invalid: [
        // 简单的单语句表达式 - 应该简化
        {
          code: `const fn = x => {
  console.log(x)
}`,
          output: 'const fn = x => console.log(x)',
          errors: [{messageId: 'preferConciseArrow'}],
        },

        // 简单的 return 语句 - 应该简化
        {
          code: `const fn = x => {
  return x + 1
}`,
          output: 'const fn = x => x + 1',
          errors: [{messageId: 'preferConciseArrow'}],
        },

        // 多参数的简单函数
        {
          code: `const add = (a, b) => {
  return a + b
}`,
          output: 'const add = (a, b) => a + b',
          errors: [{messageId: 'preferConciseArrow'}],
        },

        // async 函数
        {
          code: `const fn = async x => {
  return await fetch(x)
}`,
          output: 'const fn = async x => await fetch(x)',
          errors: [{messageId: 'preferConciseArrow'}],
        },

        // 返回对象字面量 - 应该加括号
        {
          code: `const fn = x => {
  return {value: x}
}`,
          output: 'const fn = x => ({value: x})',
          errors: [{messageId: 'preferConciseArrow'}],
        },

        // forEach 中的简单调用
        {
          code: `arr.forEach(it => {
  f.append(it.name, it.value)
})`,
          output: 'arr.forEach(it => f.append(it.name, it.value))',
          errors: [{messageId: 'preferConciseArrow'}],
        },

        // 简单方法调用
        {
          code: `const fn = item => {
  doSomething(item)
}`,
          output: 'const fn = item => doSomething(item)',
          errors: [{messageId: 'preferConciseArrow'}],
        },
      ],
    })
  })
})

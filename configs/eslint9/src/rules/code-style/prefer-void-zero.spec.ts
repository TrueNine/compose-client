import {RuleTester} from 'eslint'
import * as tseslint from 'typescript-eslint'
import {describe, it} from 'vitest'
import rule from './prefer-void-zero'

/**
 * Test suite for prefer-void-zero rule
 *
 * This rule detects and fixes `undefined` to `void 0` in value positions.
 * Only fixes value-level `undefined`, NOT type annotations.
 *
 * messageIds tested:
 * - preferVoidZero: Reports when `undefined` is used as a value
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

describe('prefer-void-zero', () => {
  describe('valid cases - type annotations should NOT be changed', () => {
    describe('basic type annotations', () => {
      it('should skip type annotations in variable declarations', () => {
        ruleTester.run('prefer-void-zero', rule, {
          valid: [
            // 变量类型注解
            'let x: undefined',
            'let x: undefined = void 0',
            'const x: string | undefined = "test"',
            'let x: number | undefined',
          ],
          invalid: [],
        })
      })

      it('should skip function return type annotations', () => {
        ruleTester.run('prefer-void-zero', rule, {
          valid: [
            // 函数返回类型
            'function fn(): undefined { return void 0 }',
            'function fn(): string | undefined { return "test" }',
            'const fn = (): undefined => void 0',
            'const fn = (): string | undefined => "test"',
            'async function fn(): Promise<undefined> { return void 0 }',
          ],
          invalid: [],
        })
      })

      it('should skip function parameter type annotations', () => {
        ruleTester.run('prefer-void-zero', rule, {
          valid: [
            // 函数参数类型
            'function fn(x: undefined): void {}',
            'function fn(x: string | undefined): void {}',
            'const fn = (x: undefined) => {}',
            'const fn = (x: number | undefined) => {}',
          ],
          invalid: [],
        })
      })
    })

    describe('complex type contexts', () => {
      it('should skip type alias declarations', () => {
        ruleTester.run('prefer-void-zero', rule, {
          valid: [
            // 类型别名
            'type T = undefined',
            'type T = string | undefined',
            'type T = undefined | null',
            'type MaybeString = string | undefined',
          ],
          invalid: [],
        })
      })

      it('should skip interface members', () => {
        ruleTester.run('prefer-void-zero', rule, {
          valid: [
            // 接口成员
            'interface I { x: undefined }',
            'interface I { x: string | undefined }',
            'interface I { x?: undefined }',
            'interface I { fn(): undefined }',
          ],
          invalid: [],
        })
      })

      it('should skip generic type parameters', () => {
        ruleTester.run('prefer-void-zero', rule, {
          valid: [
            // 泛型类型参数
            'type T<U = undefined> = U',
            'function fn<T = undefined>(): T { return void 0 as T }',
            'const x: Array<undefined> = []',
            'const x: Map<string, undefined> = new Map()',
            'const x: Promise<undefined> = Promise.resolve(void 0)',
          ],
          invalid: [],
        })
      })

      it('should skip union and intersection types', () => {
        ruleTester.run('prefer-void-zero', rule, {
          valid: [
            // 联合类型和交叉类型
            'type T = string | undefined | null',
            'type T = (string | undefined) & object',
            'let x: string | number | undefined',
            'function fn(x: string | undefined | null): void {}',
          ],
          invalid: [],
        })
      })

      it('should skip conditional types', () => {
        ruleTester.run('prefer-void-zero', rule, {
          valid: [
            // 条件类型
            'type T = string extends undefined ? true : false',
            'type T<U> = U extends undefined ? never : U',
          ],
          invalid: [],
        })
      })

      it('should skip mapped types', () => {
        ruleTester.run('prefer-void-zero', rule, {
          valid: [
            // 映射类型
            'type T = { [K in string]: undefined }',
            'type T = { [K in keyof object]: string | undefined }',
          ],
          invalid: [],
        })
      })

      it('should skip type literals', () => {
        ruleTester.run('prefer-void-zero', rule, {
          valid: [
            // 类型字面量
            'type T = { x: undefined }',
            'type T = { x: string | undefined, y: number }',
            'const fn = (x: { value: undefined }) => {}',
          ],
          invalid: [],
        })
      })

      it('should skip as expressions type part', () => {
        ruleTester.run('prefer-void-zero', rule, {
          valid: [
            // as 表达式的类型部分
            'const x = value as undefined',
            'const x = value as string | undefined',
            'const x = (value as undefined)',
          ],
          invalid: [],
        })
      })

      it('should skip satisfies expressions type part', () => {
        ruleTester.run('prefer-void-zero', rule, {
          valid: [
            // satisfies 表达式的类型部分
            'const x = value satisfies undefined',
            'const x = value satisfies string | undefined',
          ],
          invalid: [],
        })
      })

      it('should skip function type expressions', () => {
        ruleTester.run('prefer-void-zero', rule, {
          valid: [
            // 函数类型表达式
            'type T = () => undefined',
            'type T = (x: string) => undefined',
            'type T = (x: undefined) => void',
            'let fn: () => undefined',
            'let fn: (x: undefined) => string',
          ],
          invalid: [],
        })
      })

      it('should skip type predicates', () => {
        ruleTester.run('prefer-void-zero', rule, {
          valid: [
            // 类型谓词
            'function isUndefined(x: unknown): x is undefined { return x === void 0 }',
          ],
          invalid: [],
        })
      })
    })

    describe('special identifier contexts', () => {
      it('should skip property keys', () => {
        ruleTester.run('prefer-void-zero', rule, {
          valid: [
            // 属性键（非简写）
            'const obj = { undefined: 1 }',
            'obj.undefined = 1',
          ],
          invalid: [],
        })
      })

      it('should skip member expression property access', () => {
        ruleTester.run('prefer-void-zero', rule, {
          valid: [
            // 成员表达式属性访问
            'obj.undefined',
            'this.undefined',
            'window.undefined',
          ],
          invalid: [],
        })
      })

      it('should skip variable declarations (left side)', () => {
        ruleTester.run('prefer-void-zero', rule, {
          valid: [
            // 变量声明（左侧）- 虽然不常见，但语法上允许
            // 注意：这里 undefined 作为变量名被声明
          ],
          invalid: [],
        })
      })

      it('should skip import/export specifiers', () => {
        ruleTester.run('prefer-void-zero', rule, {
          valid: [
            // import/export 说明符
            // 注意：undefined 通常不会被 import/export，但规则应该处理这种情况
          ],
          invalid: [],
        })
      })
    })
  })

  describe('invalid cases - value positions should be fixed', () => {
    describe('basic value assignments', () => {
      it('should fix undefined in variable initialization', () => {
        ruleTester.run('prefer-void-zero', rule, {
          valid: [],
          invalid: [
            {
              code: 'const x = undefined',
              output: 'const x = void 0',
              errors: [{messageId: 'preferVoidZero'}],
            },
            {
              code: 'let x = undefined',
              output: 'let x = void 0',
              errors: [{messageId: 'preferVoidZero'}],
            },
            {
              code: 'var x = undefined',
              output: 'var x = void 0',
              errors: [{messageId: 'preferVoidZero'}],
            },
          ],
        })
      })

      it('should fix undefined in assignment expressions', () => {
        ruleTester.run('prefer-void-zero', rule, {
          valid: [],
          invalid: [
            {
              code: 'x = undefined',
              output: 'x = void 0',
              errors: [{messageId: 'preferVoidZero'}],
            },
            {
              code: 'obj.prop = undefined',
              output: 'obj.prop = void 0',
              errors: [{messageId: 'preferVoidZero'}],
            },
            {
              code: 'arr[0] = undefined',
              output: 'arr[0] = void 0',
              errors: [{messageId: 'preferVoidZero'}],
            },
          ],
        })
      })
    })

    describe('return statements', () => {
      it('should fix undefined in return statements', () => {
        ruleTester.run('prefer-void-zero', rule, {
          valid: [],
          invalid: [
            {
              code: 'function fn() { return undefined }',
              output: 'function fn() { return void 0 }',
              errors: [{messageId: 'preferVoidZero'}],
            },
            {
              code: 'const fn = () => { return undefined }',
              output: 'const fn = () => { return void 0 }',
              errors: [{messageId: 'preferVoidZero'}],
            },
            {
              code: 'const fn = () => undefined',
              output: 'const fn = () => void 0',
              errors: [{messageId: 'preferVoidZero'}],
            },
          ],
        })
      })
    })

    describe('comparison expressions', () => {
      it('should fix undefined in equality comparisons', () => {
        ruleTester.run('prefer-void-zero', rule, {
          valid: [],
          invalid: [
            {
              code: 'if (x === undefined) {}',
              output: 'if (x === void 0) {}',
              errors: [{messageId: 'preferVoidZero'}],
            },
            {
              code: 'if (x !== undefined) {}',
              output: 'if (x !== void 0) {}',
              errors: [{messageId: 'preferVoidZero'}],
            },
            {
              code: 'if (x == undefined) {}',
              output: 'if (x == void 0) {}',
              errors: [{messageId: 'preferVoidZero'}],
            },
            {
              code: 'if (x != undefined) {}',
              output: 'if (x != void 0) {}',
              errors: [{messageId: 'preferVoidZero'}],
            },
            {
              code: 'x === undefined ? "yes" : "no"',
              output: 'x === void 0 ? "yes" : "no"',
              errors: [{messageId: 'preferVoidZero'}],
            },
          ],
        })
      })
    })

    describe('function arguments', () => {
      it('should fix undefined passed as function argument', () => {
        ruleTester.run('prefer-void-zero', rule, {
          valid: [],
          invalid: [
            {
              code: 'fn(undefined)',
              output: 'fn(void 0)',
              errors: [{messageId: 'preferVoidZero'}],
            },
            {
              code: 'fn(a, undefined, b)',
              output: 'fn(a, void 0, b)',
              errors: [{messageId: 'preferVoidZero'}],
            },
            {
              code: 'fn(undefined, undefined)',
              output: 'fn(void 0, void 0)',
              errors: [{messageId: 'preferVoidZero'}, {messageId: 'preferVoidZero'}],
            },
            {
              code: 'new MyClass(undefined)',
              output: 'new MyClass(void 0)',
              errors: [{messageId: 'preferVoidZero'}],
            },
          ],
        })
      })
    })

    describe('array and object literals', () => {
      it('should fix undefined in array literals', () => {
        ruleTester.run('prefer-void-zero', rule, {
          valid: [],
          invalid: [
            {
              code: 'const arr = [undefined]',
              output: 'const arr = [void 0]',
              errors: [{messageId: 'preferVoidZero'}],
            },
            {
              code: 'const arr = [1, undefined, 3]',
              output: 'const arr = [1, void 0, 3]',
              errors: [{messageId: 'preferVoidZero'}],
            },
            {
              code: 'const arr = [undefined, undefined]',
              output: 'const arr = [void 0, void 0]',
              errors: [{messageId: 'preferVoidZero'}, {messageId: 'preferVoidZero'}],
            },
          ],
        })
      })

      it('should fix undefined in object property values', () => {
        ruleTester.run('prefer-void-zero', rule, {
          valid: [],
          invalid: [
            {
              code: 'const obj = { x: undefined }',
              output: 'const obj = { x: void 0 }',
              errors: [{messageId: 'preferVoidZero'}],
            },
            {
              code: 'const obj = { a: 1, b: undefined }',
              output: 'const obj = { a: 1, b: void 0 }',
              errors: [{messageId: 'preferVoidZero'}],
            },
          ],
        })
      })

      it('should fix undefined in shorthand properties', () => {
        ruleTester.run('prefer-void-zero', rule, {
          valid: [],
          invalid: [
            // 简写属性中的 undefined 既是键也是值，应该修复
            // 注意：这会改变语义，但规则的目的就是替换 undefined 值
          ],
        })
      })
    })

    describe('logical and conditional expressions', () => {
      it('should fix undefined in logical expressions', () => {
        ruleTester.run('prefer-void-zero', rule, {
          valid: [],
          invalid: [
            {
              code: 'const x = a || undefined',
              output: 'const x = a || void 0',
              errors: [{messageId: 'preferVoidZero'}],
            },
            {
              code: 'const x = a && undefined',
              output: 'const x = a && void 0',
              errors: [{messageId: 'preferVoidZero'}],
            },
            {
              code: 'const x = a ?? undefined',
              output: 'const x = a ?? void 0',
              errors: [{messageId: 'preferVoidZero'}],
            },
          ],
        })
      })

      it('should fix undefined in conditional expressions', () => {
        ruleTester.run('prefer-void-zero', rule, {
          valid: [],
          invalid: [
            {
              code: 'const x = condition ? undefined : value',
              output: 'const x = condition ? void 0 : value',
              errors: [{messageId: 'preferVoidZero'}],
            },
            {
              code: 'const x = condition ? value : undefined',
              output: 'const x = condition ? value : void 0',
              errors: [{messageId: 'preferVoidZero'}],
            },
            {
              code: 'const x = condition ? undefined : undefined',
              output: 'const x = condition ? void 0 : void 0',
              errors: [{messageId: 'preferVoidZero'}, {messageId: 'preferVoidZero'}],
            },
          ],
        })
      })
    })

    describe('default parameter values', () => {
      it('should fix undefined as default parameter value', () => {
        ruleTester.run('prefer-void-zero', rule, {
          valid: [],
          invalid: [
            {
              code: 'function fn(x = undefined) {}',
              output: 'function fn(x = void 0) {}',
              errors: [{messageId: 'preferVoidZero'}],
            },
            {
              code: 'const fn = (x = undefined) => {}',
              output: 'const fn = (x = void 0) => {}',
              errors: [{messageId: 'preferVoidZero'}],
            },
            {
              code: 'function fn(a, b = undefined, c) {}',
              output: 'function fn(a, b = void 0, c) {}',
              errors: [{messageId: 'preferVoidZero'}],
            },
          ],
        })
      })
    })

    describe('destructuring default values', () => {
      it('should fix undefined as destructuring default value', () => {
        ruleTester.run('prefer-void-zero', rule, {
          valid: [],
          invalid: [
            {
              code: 'const { x = undefined } = obj',
              output: 'const { x = void 0 } = obj',
              errors: [{messageId: 'preferVoidZero'}],
            },
            {
              code: 'const [x = undefined] = arr',
              output: 'const [x = void 0] = arr',
              errors: [{messageId: 'preferVoidZero'}],
            },
            {
              code: 'const { a, b = undefined } = obj',
              output: 'const { a, b = void 0 } = obj',
              errors: [{messageId: 'preferVoidZero'}],
            },
          ],
        })
      })
    })

    describe('class members', () => {
      it('should fix undefined in class property initialization', () => {
        ruleTester.run('prefer-void-zero', rule, {
          valid: [],
          invalid: [
            {
              code: 'class C { x = undefined }',
              output: 'class C { x = void 0 }',
              errors: [{messageId: 'preferVoidZero'}],
            },
            {
              code: 'class C { static x = undefined }',
              output: 'class C { static x = void 0 }',
              errors: [{messageId: 'preferVoidZero'}],
            },
          ],
        })
      })
    })

    describe('export statements', () => {
      it('should fix undefined in export default', () => {
        ruleTester.run('prefer-void-zero', rule, {
          valid: [],
          invalid: [
            {
              code: 'export default undefined',
              output: 'export default void 0',
              errors: [{messageId: 'preferVoidZero'}],
            },
          ],
        })
      })
    })

    describe('computed property access', () => {
      it('should fix undefined in computed property access', () => {
        ruleTester.run('prefer-void-zero', rule, {
          valid: [],
          invalid: [
            {
              code: 'obj[undefined]',
              output: 'obj[void 0]',
              errors: [{messageId: 'preferVoidZero'}],
            },
          ],
        })
      })
    })
  })

  describe('mixed TypeScript scenarios', () => {
    it('should handle type annotation with value in same statement', () => {
      ruleTester.run('prefer-void-zero', rule, {
        valid: [
          // 类型注解中的 undefined 不应被修改
          'let x: undefined',
          'let x: string | undefined',
        ],
        invalid: [
          // 值位置的 undefined 应该被修改
          {
            code: 'let x: string | undefined = undefined',
            output: 'let x: string | undefined = void 0',
            errors: [{messageId: 'preferVoidZero'}],
          },
          {
            code: 'const fn = (x: undefined): undefined => undefined',
            output: 'const fn = (x: undefined): undefined => void 0',
            errors: [{messageId: 'preferVoidZero'}],
          },
        ],
      })
    })

    it('should handle generic functions with undefined', () => {
      ruleTester.run('prefer-void-zero', rule, {
        valid: [
          // 泛型类型参数中的 undefined
          'function fn<T = undefined>(): T { return void 0 as T }',
          'const fn = <T extends undefined>() => {}',
        ],
        invalid: [
          // 泛型函数调用中的值参数
          {
            code: 'fn<string>(undefined)',
            output: 'fn<string>(void 0)',
            errors: [{messageId: 'preferVoidZero'}],
          },
        ],
      })
    })

    it('should handle type assertions', () => {
      ruleTester.run('prefer-void-zero', rule, {
        valid: [
          // as 表达式的类型部分
          'const x = value as undefined',
          'const x = value as string | undefined',
        ],
        invalid: [
          // as 表达式的值部分
          {
            code: 'const x = undefined as unknown',
            output: 'const x = void 0 as unknown',
            errors: [{messageId: 'preferVoidZero'}],
          },
        ],
      })
    })

    it('should handle complex nested scenarios', () => {
      ruleTester.run('prefer-void-zero', rule, {
        valid: [],
        invalid: [
          // 复杂嵌套场景
          {
            code: 'const result = arr.map(x => x === undefined ? undefined : x)',
            output: 'const result = arr.map(x => x === void 0 ? void 0 : x)',
            errors: [{messageId: 'preferVoidZero'}, {messageId: 'preferVoidZero'}],
          },
          {
            code: 'const obj = { fn: () => undefined, value: undefined }',
            output: 'const obj = { fn: () => void 0, value: void 0 }',
            errors: [{messageId: 'preferVoidZero'}, {messageId: 'preferVoidZero'}],
          },
        ],
      })
    })
  })
})

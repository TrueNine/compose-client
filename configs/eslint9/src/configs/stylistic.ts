import type {AntFuStylisticConfig} from '../types'

/** Stylistic 代码风格配置 */
export const stylisticConfig: AntFuStylisticConfig = {
  jsx: true,
  indent: 2,
  quotes: 'single',
  semi: false,
  overrides: {
    'style/no-multiple-empty-lines': ['error', {max: 1, maxBOF: 0, maxEOF: 0}],
    // } catch / } else / } finally 必须在同一行
    'style/brace-style': ['error', '1tbs', {allowSingleLine: true}],
    'style/arrow-parens': ['error', 'as-needed'],
    'curly': ['error', 'multi-line'],
    'antfu/if-newline': 'off',
    'antfu/curly': 'off',
    // ===== 紧凑风格：移除不必要的空格 =====
    // 对象花括号内不加空格 { a } → {a}
    'style/object-curly-spacing': ['error', 'never'],
    // 数组括号内不加空格 [ a ] → [a]
    'style/array-bracket-spacing': ['error', 'never'],
    // 计算属性括号内不加空格 obj[ key ] → obj[key]
    'style/computed-property-spacing': ['error', 'never'],
    // 模板字符串花括号内不加空格 ${ a } → ${a}
    'style/template-curly-spacing': ['error', 'never'],
    // 函数调用括号前不加空格 fn () → fn()
    'style/function-call-spacing': ['error', 'never'],
    // 块语句前加空格 if(x){} → if (x) {}
    'style/space-before-blocks': ['error', 'always'],
    // 函数括号前不加空格 function () → function()
    'style/space-before-function-paren': ['error', {anonymous: 'never', named: 'never', asyncArrow: 'always'}],
    // 括号内不加空格 ( a ) → (a)
    'style/space-in-parens': ['error', 'never'],
    // 对象冒号后加空格，前不加 {a : 1} → {a: 1}
    'style/key-spacing': ['error', {beforeColon: false, afterColon: true}],
    // 逗号后加空格，前不加 [a ,b] → [a, b]
    'style/comma-spacing': ['error', {before: false, after: true}],
    // 分号后加空格，前不加
    'style/semi-spacing': ['error', {before: false, after: true}],
    // 箭头函数箭头前后加空格 x=>y → x => y
    'style/arrow-spacing': ['error', {before: true, after: true}],
    // 关键字前后加空格 if(x){}else{} → if (x) {} else {}
    'style/keyword-spacing': ['error', {before: true, after: true}],
    // 操作符周围加空格 a+b → a + b
    'style/space-infix-ops': 'error',
    // 一元操作符空格 ! x → !x, typeof x 保持
    'style/space-unary-ops': ['error', {words: true, nonwords: false}],
    // 注释后加空格 //comment → // comment
    'style/spaced-comment': ['error', 'always', {markers: ['/']}],
    // 类型注解冒号后加空格 x:string → x: string
    'style/type-annotation-spacing': 'error',
    // 允许每行最多 3 条语句（支持 case x: stmt; break 格式）
    'style/max-statements-per-line': ['error', {max: 3}],
    // 函数调用参数换行：短参数允许单行
    'style/function-call-argument-newline': ['error', 'consistent'],
    // 函数参数换行：短参数允许单行
    'style/function-paren-newline': ['error', 'multiline-arguments'],
    // 关闭 object-curly-newline，由 antfu/consistent-list-newline 统一处理
    // 注意：import/export 的换行由 antfu/consistent-list-newline 处理
    'style/object-curly-newline': 'off',
    // 关闭 object-property-newline，由 antfu/consistent-list-newline 统一处理
    'style/object-property-newline': 'off',
    // 列表换行一致性：如果第一项换行则全部换行，否则全部单行
    'antfu/consistent-list-newline': 'error',
  },
}

/** @deprecated 使用 stylisticConfig 代替 */
export const defaultStylisticConfig: AntFuStylisticConfig = stylisticConfig

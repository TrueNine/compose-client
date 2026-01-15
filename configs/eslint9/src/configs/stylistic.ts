import type {AntFuStylisticConfig} from '../types'

/**
 * Stylistic 代码风格配置
 */
export const stylisticConfig: AntFuStylisticConfig = {
  jsx: true,
  indent: 2,
  quotes: 'single',
  semi: false,
  overrides: {
    'style/no-multiple-empty-lines': ['error', {max: 1, maxBOF: 0, maxEOF: 0}],
    'style/brace-style': ['error', '1tbs', {allowSingleLine: true}], /* } catch / } else / } finally 必须在同一行 */
    'style/arrow-parens': ['error', 'as-needed'],
    'curly': ['error', 'multi-line'],
    'antfu/if-newline': 'off',
    'antfu/curly': 'off',
    'style/object-curly-spacing': ['error', 'never'], /* ===== 紧凑风格：移除不必要的空格 ===== */
    'style/array-bracket-spacing': ['error', 'never'], /* 对象花括号内不加空格 { a } → {a} */
    'style/computed-property-spacing': ['error', 'never'], /* 数组括号内不加空格 [ a ] → [a] */
    'style/template-curly-spacing': ['error', 'never'], /* 计算属性括号内不加空格 obj[ key ] → obj[key] */
    'style/function-call-spacing': ['error', 'never'], /* 模板字符串花括号内不加空格 ${ a } → ${a} */
    'style/space-before-blocks': ['error', 'always'], /* 函数调用括号前不加空格 fn () → fn() */
    'style/space-before-function-paren': ['error', {anonymous: 'never', named: 'never', asyncArrow: 'always'}], /* 块语句前加空格 if(x){} → if (x) {} */
    'style/space-in-parens': ['error', 'never'], /* 函数括号前不加空格 function () → function() */
    'style/key-spacing': ['error', {beforeColon: false, afterColon: true}], /* 括号内不加空格 ( a ) → (a) */
    'style/comma-spacing': ['error', {before: false, after: true}], /* 对象冒号后加空格，前不加 {a : 1} → {a: 1} */
    'style/semi-spacing': ['error', {before: false, after: true}], /* 逗号后加空格，前不加 [a ,b] → [a, b] */
    'style/arrow-spacing': ['error', {before: true, after: true}], /* 分号后加空格，前不加 */
    'style/keyword-spacing': ['error', {before: true, after: true}], /* 箭头函数箭头前后加空格 x=>y → x => y */
    'style/space-infix-ops': 'error', /* 关键字前后加空格 if(x){}else{} → if (x) {} else {} */
    'style/space-unary-ops': ['error', {words: true, nonwords: false}], /* 操作符周围加空格 a+b → a + b */
    'style/spaced-comment': ['error', 'always', {markers: ['/']}], /* 一元操作符空格 ! x → !x, typeof x 保持 */
    'style/type-annotation-spacing': 'error', /* 注释后加空格 //comment → // comment */
    'style/max-statements-per-line': ['error', {max: 3}], /* 类型注解冒号后加空格 x:string → x: string */
    'style/function-call-argument-newline': ['error', 'consistent'], /* 函数调用参数换行：短参数允许单行 */
    'style/function-paren-newline': ['error', 'multiline-arguments'], /* 函数调用参数换行：短参数允许单行 */
    'style/object-curly-newline': 'off', /* 函数参数换行：短参数允许单行 */
    'style/object-property-newline': 'off', /* 关闭 object-curly-newline，由 antfu/consistent-list-newline 统一处理 */
    'antfu/consistent-list-newline': 'error', /* 关闭 object-property-newline，由 antfu/consistent-list-newline 统一处理 */
    'no-inline-comments': 'off', /* 允许行内注释 */
    'style/line-comment-position': 'off', /* 由 truenine/beside-comment 接管 */
    '@truenine/beside-comment': 'error', /* 强制普通注释在代码行尾 */
  },
}

/**
 * @deprecated 使用 stylisticConfig 代替
 */
export const defaultStylisticConfig: AntFuStylisticConfig = stylisticConfig

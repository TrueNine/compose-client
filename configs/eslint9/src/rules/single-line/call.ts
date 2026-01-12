import type {Rule} from 'eslint'

const MAX_LINE_LENGTH = 160

/**
 * ESLint rule: prefer-single-line-call
 *
 * Detects and fixes function calls that can be compressed to a single line.
 *
 * @example
 * // Before
 * this.connection.send(
 *   JSON.stringify({type: 'shutdown'}),
 * )
 *
 * // After
 * this.connection.send(JSON.stringify({type: 'shutdown'}))
 */
interface RuleOptions {
  maxLineLength?: number
}

const rule: Rule.RuleModule = {meta: {
  type: 'layout',
  docs: {description: 'Prefer single-line function calls when the result fits within max line length', recommended: false},
  fixable: 'code',
  schema: [
    {type: 'object', properties: {maxLineLength: {type: 'number', default: MAX_LINE_LENGTH}}, additionalProperties: false},
  ],
  messages: {preferSingleLineCall: 'Function call can be written on a single line'},
}, create(context) {
  const {sourceCode} = context
  const options = (context.options[0] ?? {}) as RuleOptions
  const maxLineLength = options.maxLineLength ?? MAX_LINE_LENGTH

  function hasComments(node: Rule.Node): boolean {
    const comments = sourceCode.getCommentsInside(node)
    return comments.length > 0
  }

  function isNodeMultiLine(node: Rule.Node): boolean {
    return node.loc!.start.line !== node.loc!.end.line
  }

  function normalizeText(text: string): string {
    return text
      .split('\n')
      .map(line => line.trim())
      .join(' ')
      .replaceAll(/\s+/g, ' ')
      .trim()
  }

  // 获取调用表达式的缩进
  function getIndent(node: Rule.Node): string {
    const line = sourceCode.lines[node.loc!.start.line - 1]
    const match = /^(\s*)/.exec(line)
    return match?.[1] ?? ''
  }

  // 检查节点是否包含嵌套的对象字面量（会与 antfu/consistent-list-newline 冲突）
  function hasNestedObjectLiteral(node: Rule.Node): boolean {
    if (node.type !== 'ObjectExpression') return false

    const objNode = node as Rule.Node & {properties: (Rule.Node & {value?: Rule.Node})[]}
    for (const prop of objNode.properties) {
      if (prop.type === 'Property' && prop.value !== void 0) {
        if (prop.value.type === 'ObjectExpression' || prop.value.type === 'ArrayExpression') return true
      }
    }
    return false
  }

  // 检查参数是否包含复杂结构（多行对象/数组字面量、函数等）
  function hasComplexArgument(args: Rule.Node[]): boolean {
    for (const arg of args) {
      // 箭头函数或普通函数表达式通常应该保持多行
      if (arg.type === 'ArrowFunctionExpression' || arg.type === 'FunctionExpression') return true
      // 模板字面量包含换行
      if (arg.type === 'TemplateLiteral') {
        const text = sourceCode.getText(arg)
        if (text.includes('\n')) return true
      }
      // 对象字面量有 5 个及以上属性时保持多行（与 object-curly-newline 规则一致）
      if (arg.type === 'ObjectExpression') {
        const objArg = arg as Rule.Node & {properties: Rule.Node[]}
        if (objArg.properties.length >= 5) return true
        // 跳过包含嵌套对象的情况（会与 antfu/consistent-list-newline 冲突）
        if (hasNestedObjectLiteral(arg)) return true
      }
      // 数组字面量有 4 个及以上元素时保持多行
      if (arg.type === 'ArrayExpression') {
        const arrArg = arg as Rule.Node & {elements: Rule.Node[]}
        if (arrArg.elements.length >= 4) return true
      }
      // 递归检查嵌套调用
      if (arg.type === 'CallExpression') {
        const callArg = arg as Rule.Node & {arguments: Rule.Node[]}
        if (hasComplexArgument(callArg.arguments)) return true
      }
    }
    return false
  }

  // 检查是否是链式调用的一部分（如 app.get(...).post(...)）
  function isPartOfChainedCall(node: Rule.Node): boolean {
    const {parent} = node
    if (!parent) return false
    // 如果父节点是 MemberExpression 且该 MemberExpression 的父节点是 CallExpression
    if (parent.type !== 'MemberExpression') return false

    const grandParent = parent.parent
    if (grandParent?.type === 'CallExpression') return true
    return false
  }

  // 检查是否是链式方法调用（如 str.replaceAll().replaceAll()）
  function isChainedMethodCall(node: Rule.Node): boolean {
    const callNode = node as Rule.Node & {callee: Rule.Node}
    // 如果 callee 是 MemberExpression，检查其 object 是否也是 CallExpression
    if (callNode.callee.type !== 'MemberExpression') return false

    const memberExpr = callNode.callee as Rule.Node & {object: Rule.Node}
    if (memberExpr.object.type === 'CallExpression') return true
    return false
  }

  return {CallExpression(node) {
    const callNode = node as Rule.Node & {
      callee: Rule.Node
      arguments: Rule.Node[]
    }

    // 只处理多行的调用
    if (!isNodeMultiLine(callNode)) return

    // 跳过有注释的
    if (hasComments(callNode)) return

    // 跳过包含复杂参数的
    if (hasComplexArgument(callNode.arguments)) return

    // 跳过链式调用的一部分
    if (isPartOfChainedCall(callNode)) return

    // 跳过链式方法调用
    if (isChainedMethodCall(callNode)) return

    // 生成单行版本
    const calleeText = sourceCode.getText(callNode.callee)
    const argsText = callNode.arguments
      .map(arg => normalizeText(sourceCode.getText(arg)))
      .join(', ')
    const singleLineText = `${calleeText}(${argsText})`

    // 计算实际行长度（包含缩进）
    const indent = getIndent(callNode)
    const totalLength = indent.length + singleLineText.length

    // 如果超过最大行长度，不修复
    if (totalLength > maxLineLength) return

    context.report({node, messageId: 'preferSingleLineCall', fix(fixer) { return fixer.replaceText(node, singleLineText) }})
  }}
}}

export default rule

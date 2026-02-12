import type {Rule} from 'eslint'

const MAX_LINE_LENGTH = 160

/**
 * ESLint rule: prefer-single-line-call
 * Detects and fixes function calls that can be compressed to a single line.
 */
interface RuleOptions {maxLineLength?: number}

const rule: Rule.RuleModule = {
  meta: {
    type: 'layout',
    docs: {description: 'Prefer single-line function calls when the result fits within max line length', recommended: false},
    fixable: 'code',
    schema: [{type: 'object', properties: {maxLineLength: {type: 'number', default: MAX_LINE_LENGTH}}, additionalProperties: false}],
    messages: {preferSingleLineCall: 'Function call can be written on a single line'}
  },
  create(context) {
    const {sourceCode} = context
    const options = (context.options[0] ?? {}) as RuleOptions
    const maxLineLength = options.maxLineLength ?? MAX_LINE_LENGTH

    function hasComments(node: Rule.Node): boolean { return sourceCode.getCommentsInside(node).length > 0 }
    function isNodeMultiLine(node: Rule.Node): boolean { return node.loc!.start.line !== node.loc!.end.line }
    function normalizeText(text: string): string { return text.split('\n').map(l => l.trim()).join(' ').replaceAll(/\s+/g, ' ').trim() }

    function getIndent(node: Rule.Node): string { /* 获取调用表达式的缩进 */
      const line = sourceCode.lines[node.loc!.start.line - 1]
      return /^(\s*)/.exec(line)?.[1] ?? ''
    }

    function hasNestedObjectLiteral(node: Rule.Node): boolean { /* 检查节点是否包含嵌套的对象字面量 */
      if (node.type !== 'ObjectExpression') return false
      const objNode = node as Rule.Node & {properties: (Rule.Node & {value?: Rule.Node})[]}
      for (const prop of objNode.properties) {
        if (prop.type === 'Property' && (prop.value?.type === 'ObjectExpression' || prop.value?.type === 'ArrayExpression')) return true
      }
      return false
    }

    function hasComplexArgument(args: Rule.Node[]): boolean { /* 检查参数是否包含复杂结构 */
      for (const arg of args) {
        if (['ArrowFunctionExpression', 'FunctionExpression'].includes(arg.type)) return true /* 箭头函数或普通函数表达式 */
        if (arg.type === 'TemplateLiteral' && sourceCode.getText(arg).includes('\n')) return true /* 模板字面量包含换行 */
        if (arg.type === 'ObjectExpression') {
          const objArg = arg as Rule.Node & {properties: Rule.Node[]}
          if (objArg.properties.length >= 5 || hasNestedObjectLiteral(arg)) return true /* 5 个及以上属性或嵌套对象 */
        }
        if (arg.type === 'ArrayExpression' && (arg as Rule.Node & {elements: Rule.Node[]}).elements.length >= 4) return true /* 数组字面量有 4 个及以上元素 */
        if (arg.type === 'CallExpression' && hasComplexArgument((arg as Rule.Node & {arguments: Rule.Node[]}).arguments)) return true /* 递归检查嵌套调用 */
      }
      return false
    }

    function isPartOfChainedCall(node: Rule.Node): boolean { /* 检查是否是链式调用的一部分 */
      const {parent} = node
      return parent?.type === 'MemberExpression' && parent.parent?.type === 'CallExpression'
    }

    function isChainedMethodCall(node: Rule.Node): boolean { /* 检查是否是链式方法调用 */
      const callNode = node as Rule.Node & {callee: Rule.Node}
      return callNode.callee.type === 'MemberExpression' && (callNode.callee as Rule.Node & {object: Rule.Node}).object.type === 'CallExpression'
    }

    return {
      CallExpression(node) {
        const callNode = node as Rule.Node & {callee: Rule.Node, arguments: Rule.Node[]}
        if (!isNodeMultiLine(callNode) || hasComments(callNode) || hasComplexArgument(callNode.arguments) || isPartOfChainedCall(callNode) || isChainedMethodCall(callNode)) return

        if (callNode.loc!.end.line - callNode.loc!.start.line + 1 > 4) return // 检查行数是否超过 4 行

        const calleeText = sourceCode.getText(callNode.callee)
        const argsText = callNode.arguments.map(arg => normalizeText(sourceCode.getText(arg))).join(', ')
        const singleLineText = `${calleeText}(${argsText})`

        if (singleLineText.length > 80) return // 检查字数是否超过 80
        if (getIndent(callNode).length + singleLineText.length > maxLineLength) return /* 如果超过最大行长度，不修复 */

        context.report({node, messageId: 'preferSingleLineCall', fix: fixer => fixer.replaceText(node, singleLineText)})
      }
    }
  }
}

export default rule

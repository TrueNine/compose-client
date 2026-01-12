import type {Rule} from 'eslint'

const MAX_LINE_LENGTH = 160

/**
 * ESLint rule: prefer-concise-arrow
 *
 * Detects and fixes arrow functions that can be simplified.
 *
 * @example
 * // Before
 * arr.forEach(it => {
 *   f.append(it.name, it.value)
 * })
 *
 * // After
 * arr.forEach(it => f.append(it.name, it.value))
 */
const rule: Rule.RuleModule = {meta: {
  type: 'layout',
  docs: {description: 'Prefer concise arrow function body when possible', recommended: false},
  fixable: 'code',
  schema: [],
  messages: {preferConciseArrow: 'Arrow function body can be simplified to a single expression'},
}, create(context) {
  const {sourceCode} = context

  function hasComments(node: Rule.Node): boolean {
    const comments = sourceCode.getCommentsInside(node)
    return comments.length > 0
  }

  function isNodeSingleLine(node: Rule.Node): boolean {
    return node.loc!.start.line === node.loc!.end.line
  }

  function normalizeText(text: string): string {
    return text.split('\n').map(line => line.trim()).join(' ').replaceAll(/\s+/g, ' ').trim()
  }

  // 获取节点的缩进
  function getIndent(node: Rule.Node): string {
    const line = sourceCode.lines[node.loc!.start.line - 1]
    const match = /^(\s*)/.exec(line)
    return match?.[1] ?? ''
  }

  // 检查表达式是否包含嵌套的箭头函数或复杂结构
  function containsNestedComplexity(node: Rule.Node): boolean {
    let hasComplexity = false
    const visited = new WeakSet<object>()

    // 需要跳过的 AST 元数据属性
    const skipKeys = new Set(['parent', 'loc', 'range', 'start', 'end', 'tokens', 'comments'])

    function traverse(n: Rule.Node): void {
      if (hasComplexity) return
      if (visited.has(n)) return
      visited.add(n)

      // 包含嵌套箭头函数
      if (n.type === 'ArrowFunctionExpression') {
        hasComplexity = true
        return
      }

      // 包含三元表达式
      if (n.type === 'ConditionalExpression') {
        hasComplexity = true
        return
      }

      // 包含逻辑表达式链
      if (n.type === 'LogicalExpression') {
        hasComplexity = true
        return
      }

      // 遍历子节点
      for (const key of Object.keys(n)) {
        if (skipKeys.has(key)) continue
        const value = (n as Record<string, unknown>)[key]
        if (value && typeof value === 'object') {
          if (Array.isArray(value)) {
            for (const item of value) {
              if (item && typeof item === 'object' && 'type' in item) {
                traverse(item as Rule.Node)
              }
            }
          } else if ('type' in value) {
            traverse(value as Rule.Node)
          }
        }
      }
    }

    traverse(node)
    return hasComplexity
  }

  type ArrowNode = Rule.Node & {
    params: Rule.Node[]
    body: Rule.Node
    async: boolean
    expression: boolean
  }

  type BlockNode = Rule.Node & {body: Rule.Node[]}

  return {ArrowFunctionExpression(node) {
    const arrowNode = node as ArrowNode

    // 只处理有 BlockStatement 体的箭头函数
    if (arrowNode.expression) return
    if (arrowNode.body.type !== 'BlockStatement') return

    const blockBody = arrowNode.body as BlockNode

    // 只处理单语句的块
    if (blockBody.body.length !== 1) return

    const stmt = blockBody.body[0]

    // 跳过有注释的
    if (hasComments(blockBody)) return

    // 处理 ExpressionStatement（如 f.append(...)）
    if (stmt.type === 'ExpressionStatement') {
      const exprStmt = stmt as Rule.Node & {expression: Rule.Node}
      const expr = exprStmt.expression

      // 跳过已经是单行的
      if (isNodeSingleLine(arrowNode)) return

      // 跳过包含嵌套箭头函数、三元表达式等复杂结构的情况
      if (containsNestedComplexity(expr)) return

      // 生成简化版本
      const paramsText = arrowNode.params.map(p => sourceCode.getText(p)).join(', ')
      const exprText = normalizeText(sourceCode.getText(expr))
      const asyncPrefix = arrowNode.async ? 'async ' : ''
      const paramsWrapper = arrowNode.params.length === 1 && arrowNode.params[0].type === 'Identifier' ? paramsText : `(${paramsText})`
      const singleLineText = `${asyncPrefix}${paramsWrapper} => ${exprText}`

      // 检查长度
      const indent = getIndent(arrowNode)
      if (indent.length + singleLineText.length > MAX_LINE_LENGTH) return

      context.report({node, messageId: 'preferConciseArrow', fix(fixer) { return fixer.replaceText(node, singleLineText) }})
      return
    }

    // 处理 ReturnStatement
    if (stmt.type !== 'ReturnStatement') return

    const returnStmt = stmt as Rule.Node & {argument: Rule.Node | null}
    if (!returnStmt.argument) return
    if (isNodeSingleLine(arrowNode)) return

    // 跳过包含嵌套箭头函数、三元表达式等复杂结构的情况
    if (containsNestedComplexity(returnStmt.argument)) return

    const paramsText = arrowNode.params.map(p => sourceCode.getText(p)).join(', ')
    const returnText = normalizeText(sourceCode.getText(returnStmt.argument))
    const asyncPrefix = arrowNode.async ? 'async ' : ''
    const paramsWrapper = arrowNode.params.length === 1 && arrowNode.params[0].type === 'Identifier' ? paramsText : `(${paramsText})`
    let exprText = returnText
    if (returnStmt.argument.type === 'ObjectExpression') exprText = `(${returnText})`
    const singleLineText = `${asyncPrefix}${paramsWrapper} => ${exprText}`
    const indent = getIndent(arrowNode)
    if (indent.length + singleLineText.length > MAX_LINE_LENGTH) return
    context.report({node, messageId: 'preferConciseArrow', fix(fixer) { return fixer.replaceText(node, singleLineText) }})
  }}
}}

export default rule

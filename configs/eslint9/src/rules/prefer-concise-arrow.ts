import type {Rule} from 'eslint'

const MAX_LINE_LENGTH = 160

/**
 * 检测并修复可以简化的箭头函数
 *
 * 例如：
 * ```ts
 * // 修复前
 * arr.forEach(it => {
 *   f.append(it.name, it.value)
 * })
 *
 * // 修复后
 * arr.forEach(it => f.append(it.name, it.value))
 * ```
 */
const rule: Rule.RuleModule = {meta: {
  type: 'layout',
  docs: {description: 'Prefer concise arrow function body when possible',
    recommended: false},
  fixable: 'code',
  schema: [],
  messages: {preferConciseArrow: 'Arrow function body can be simplified to a single expression'},
},
create(context) {
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

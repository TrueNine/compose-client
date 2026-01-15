/* eslint-disable ts/no-unsafe-member-access, ts/no-unsafe-argument, ts/no-unsafe-assignment, ts/strict-boolean-expressions */
import type {Rule} from 'eslint'

const MAX_LINE_LENGTH = 160

/**
 * ESLint rule: prefer-concise-arrow
 * Detects and fixes arrow functions that can be simplified.
 */
const rule: Rule.RuleModule = {
  meta: {
    type: 'layout',
    docs: {description: 'Prefer concise arrow function body when possible', recommended: false},
    fixable: 'code',
    schema: [],
    messages: {preferConciseArrow: 'Arrow function body can be simplified to a single expression'},
  },
  create(context) {
    const {sourceCode} = context
    function hasComments(node: Rule.Node): boolean { return sourceCode.getCommentsInside(node).length > 0 }
    function isNodeSingleLine(n: Rule.Node): boolean { return n.loc!.start.line === n.loc!.end.line }
    function normalizeText(t: string): string { return t.split('\n').map(l => l.trim()).join(' ').replaceAll(/\s+/g, ' ').trim() }
    function getIndent(node: Rule.Node): string { return ' '.repeat(node.loc?.start.column ?? 0) }

    function containsNestedComplexity(node: Rule.Node): boolean { /* 检查表达式是否包含嵌套的箭头函数或复杂结构 */
      let complexity = false
      const skip = new Set(['parent', 'loc', 'range', 'start', 'end', 'tokens', 'comments'])
      const traverse = (n: any): void => {
        if (complexity || n == null || typeof n !== 'object') return
        if (['ArrowFunctionExpression', 'ConditionalExpression', 'LogicalExpression'].includes(n.type as string)) { complexity = true; return }
        Object.keys(n).forEach(k => {
          if (skip.has(k)) return

          const v = n[k]
          if (Array.isArray(v)) v.forEach(traverse); else traverse(v)
        })
      }
      traverse(node); return complexity
    }

    function needsParens(params: Rule.Node[]): boolean { /* 检查参数是否需要括号 */
      if (params.length !== 1 || params[0].type !== 'Identifier') return true
      return (params[0] as any).typeAnnotation != null
    }

    return {
      ArrowFunctionExpression(node) {
        const arrow = node as any
        if (arrow.expression || arrow.body.type !== 'BlockStatement' || arrow.body.body.length !== 1 || hasComments(arrow.body) || isNodeSingleLine(arrow)) return
        const stmt = arrow.body.body[0]
        let expr: Rule.Node | null = null
        if (stmt.type === 'ExpressionStatement') expr = stmt.expression
        else if (stmt.type === 'ReturnStatement') expr = stmt.argument
        if (expr == null || containsNestedComplexity(expr)) return

        const paramsText = (arrow.params as any[]).map((p: any) => sourceCode.getText(p)).join(', ')
        const exprText = normalizeText(sourceCode.getText(expr))
        const paramsWrapper = needsParens(arrow.params) ? `(${paramsText})` : paramsText
        const bodyText = expr.type === 'ObjectExpression' ? `(${exprText})` : exprText
        const result = `${arrow.async === true ? 'async ' : ''}${paramsWrapper} => ${bodyText}`

        if (getIndent(arrow).length + result.length > MAX_LINE_LENGTH) return
        context.report({node, messageId: 'preferConciseArrow', fix: fixer => fixer.replaceText(node, result)})
      },
    }
  },
}

export default rule

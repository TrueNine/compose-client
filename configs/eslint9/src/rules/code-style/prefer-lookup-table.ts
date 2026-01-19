import type {Rule} from 'eslint'

/**
 * ESLint rule: prefer-lookup-table
 *
 * Detects long chains of `||` checks against the same variable and suggests using a Set lookup or Array.includes.
 */
const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer Set.has or Array.includes for multiple equality checks against the same variable',
      recommended: false
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          threshold: {type: 'integer', minimum: 3, default: 4}
        },
        additionalProperties: false
      }
    ],
    messages: {
      preferLookup: 'Found {{count}} checks against the same value. Consider optimizing with a lookup table (Set/Array).'
    }
  },
  create(context) {
    const {sourceCode} = context
    const options = (context.options[0] ?? {}) as {threshold?: number}
    const threshold = options.threshold ?? 4

    function getNormalizedText(node: Rule.Node): string { /* 辅助函数：标准化节点文本，去除空格干扰 */
      return sourceCode.getText(node).replaceAll(/\s+/g, '')
    }

    function isEqualityCheck(node: Rule.Node): boolean { /* 辅助函数：判断是否是简单的相等比较节点 */
      if (node.type !== 'BinaryExpression') return false
      const op = (node as unknown as {operator: string}).operator
      return op === '===' || op === '=='
    }

    function isPure(node: Rule.Node): boolean { /* 辅助函数：判断节点是否包含副作用 */
      return node.type === 'Identifier' || node.type === 'MemberExpression' || node.type === 'Literal'
    }

    function collectConditions(node: Rule.Node, operator: string, conditions: Rule.Node[] = []): Rule.Node[] { /* 递归收集 LogicalExpression 中的所有条件 */
      if (node.type === 'LogicalExpression' && (node as unknown as {operator: string}).operator === operator) {
        const logicalNode = node as Rule.Node & {left: Rule.Node, right: Rule.Node, operator: string}
        collectConditions(logicalNode.left, operator, conditions)
        collectConditions(logicalNode.right, operator, conditions)
      } else conditions.push(node)
      return conditions
    }

    const reportSet = new Set<Rule.Node>()

    return {
      LogicalExpression(node) {
        if ((node as unknown as {operator: string}).operator !== '||') return /* 只处理 || 链 */
        if (reportSet.has(node)) return /* 避免重复报告子节点 */
        const currentParent = node.parent
        if (currentParent?.type === 'LogicalExpression' && (currentParent as unknown as {operator: string}).operator === '||') return /* 让顶层处理 */

        const conditions = collectConditions(node, '||')
        if (conditions.length < threshold) return

        const subjectMap = new Map<string, {subject: Rule.Node, values: Rule.Node[]}>() /* 分析每个条件 */

        for (const condition of conditions) {
          if (!isEqualityCheck(condition)) continue /* 必须是相等比较 */

          const binExpr = condition as Rule.Node & {left: Rule.Node, right: Rule.Node}
          let subject: Rule.Node | null = null
          let value: Rule.Node | null = null

          if (isPure(binExpr.left) && binExpr.right.type === 'Literal') { /* 尝试找出 subject (变量) 和 value (字面量) */
            subject = binExpr.left
            value = binExpr.right
          } else if (isPure(binExpr.right) && binExpr.left.type === 'Literal') {
            subject = binExpr.right
            value = binExpr.left
          }

          if (subject !== null && value !== null) {
            const subjectKey = getNormalizedText(subject)
            if (!subjectMap.has(subjectKey)) subjectMap.set(subjectKey, {subject, values: []})
            subjectMap.get(subjectKey)!.values.push(value)
          }
        }

        for (const [_, {subject, values}] of subjectMap.entries()) { /* 检查是否有某个 subject 超过阈值 */
          if (values.length >= threshold) {
            context.report({
              node,
              messageId: 'preferLookup',
              data: {count: values.length.toString()},
              fix(fixer) {
                const valuesText = values.map((v: Rule.Node) => sourceCode.getText(v)).join(', ')
                const subjectText = sourceCode.getText(subject)
                return fixer.replaceText(node, `new Set([${valuesText}]).has(${subjectText})`)
              }
            })
            break
          }
        }
      }
    }
  }
}

export default rule

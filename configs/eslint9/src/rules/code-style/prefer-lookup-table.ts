import type {Rule} from 'eslint'

/**
 * ESLint rule: prefer-lookup-table
 *
 * Detects long chains of `||` checks against the same variable and suggests using a Set loopup or Array.includes.
 *
 * @example
 * // Before
 * if (type === 'A' || type === 'B' || type === 'C' || type === 'D') {}
 *
 * // After
 * const types = new Set(['A', 'B', 'C', 'D'])
 * if (types.has(type)) {}
 */
const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer Set.has or Array.includes for multiple equality checks against the same variable',
      recommended: false,
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          threshold: {type: 'integer', minimum: 3, default: 4},
        },
        additionalProperties: false,
      },
    ],
    messages: {
      preferLookup: 'Found {{count}} checks against the same value. Consider optimizing with a lookup table (Set/Array).',
    },
  },
  create(context) {
    const {sourceCode} = context
    const options = (context.options[0] ?? {}) as {threshold?: number}
    const threshold = options.threshold ?? 4

    // 辅助函数：标准化节点文本，去除空格干扰
    function getNormalizedText(node: Rule.Node): string {
      return sourceCode.getText(node).replaceAll(/\s+/g, '')
    }

    // 辅助函数：判断是否是简单的相等比较节点
    function isEqualityCheck(node: Rule.Node): boolean {
      if (node.type !== 'BinaryExpression') return false
      const op = (node as unknown as {operator: string}).operator
      return op === '===' || op === '=='
    }

    // 辅助函数：判断节点是否包含副作用（简单判断是否是标识符或成员表达式）
    function isPure(node: Rule.Node): boolean {
      return node.type === 'Identifier' || node.type === 'MemberExpression' || node.type === 'Literal'
    }

    // 递归收集 LogicalExpression 中的所有条件
    function collectConditions(node: Rule.Node, operator: string, conditions: Rule.Node[] = []): Rule.Node[] {
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
        // 只处理 || 链
        if ((node as unknown as {operator: string}).operator !== '||') return

        // 避免重复报告子节点
        if (reportSet.has(node)) return
        // 向上查找，如果是顶层的 LogicalExpression 再处理
        const currentParent = node.parent
        if (currentParent?.type === 'LogicalExpression' && (currentParent as unknown as {operator: string}).operator === '||') {
          // 让顶层处理
          return
        }

        const conditions = collectConditions(node, '||')
        if (conditions.length < threshold) return

        // 分析每个条件
        const subjectMap = new Map<string, {subject: Rule.Node, values: Rule.Node[]}>()

        for (const condition of conditions) {
          // 必须是相等比较
          if (!isEqualityCheck(condition)) continue

          const binExpr = condition as Rule.Node & {left: Rule.Node, right: Rule.Node}
          let subject: Rule.Node | null = null
          let value: Rule.Node | null = null

          // 尝试找出 subject (变量) 和 value (字面量)
          // 假设字面量在右边
          if (isPure(binExpr.left) && binExpr.right.type === 'Literal') {
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

        // 检查是否有某个 subject 超过阈值
        for (const [_, {subject, values}] of subjectMap.entries()) {
          if (values.length >= threshold) {
            context.report({
              node,
              messageId: 'preferLookup',
              data: {
                count: values.length.toString(),
              },
              fix(fixer) {
                const valuesText = values.map((v: Rule.Node) => sourceCode.getText(v)).join(', ')
                const subjectText = sourceCode.getText(subject)
                const replacement = `new Set([${valuesText}]).has(${subjectText})`
                return fixer.replaceText(node, replacement)
              },
            })
            break
          }
        }
      },
    }
  },
}

export default rule

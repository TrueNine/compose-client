import type {Rule} from 'eslint'

/**
 * ESLint rule: prefer-guard-clause
 * Prefer guard clauses (early returns) to reduce nesting.
 */
interface RuleOptions {minStatements?: number}

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {description: 'Prefer guard clauses (early returns) to reduce nesting', recommended: false},
    fixable: 'code',
    schema: [{type: 'object', properties: {minStatements: {type: 'number', default: 2}}, additionalProperties: false}],
    messages: {preferGuardClause: 'Prefer guard clause with early return to reduce nesting'}
  },
  create(context) {
    const {sourceCode} = context
    const options = (context.options[0] ?? {}) as RuleOptions
    const minStatements = options.minStatements ?? 2

    function isFunctionBody(node: Rule.Node): boolean {
      const {parent} = node
      return parent != null && ['FunctionDeclaration', 'FunctionExpression', 'ArrowFunctionExpression'].includes(parent.type)
    }

    function invertCondition(conditionText: string): string {
      const trimmed = conditionText.trim()
      if (trimmed.startsWith('!') && !trimmed.startsWith('!=')) {
        const inner = trimmed.slice(1).trim()
        return inner.startsWith('(') && inner.endsWith(')') ? inner.slice(1, -1) : inner
      }
      if (trimmed.includes('===')) return trimmed.replace('===', '!==')
      if (trimmed.includes('!==')) return trimmed.replace('!==', '===')
      if (trimmed.includes('==') && !trimmed.includes('===')) return trimmed.replace('==', '!=')
      if (trimmed.includes('!=') && !trimmed.includes('!==')) return trimmed.replace('!=', '==')
      if (trimmed.includes('>=')) return trimmed.replace('>=', '<')
      if (trimmed.includes('<=')) return trimmed.replace('<=', '>')
      if (trimmed.includes('>') && !trimmed.includes('>=')) return trimmed.replace('>', '<=')
      if (trimmed.includes('<') && !trimmed.includes('<=')) return trimmed.replace('<', '>=')

      if (/\.length\s*>\s*0/.test(trimmed)) return trimmed.replace(/\.length\s*>\s*0/, '.length === 0')
      if (/\.length\s*===\s*0/.test(trimmed)) return trimmed.replace(/\.length\s*===\s*0/, '.length > 0')

      return trimmed.includes('&&') || trimmed.includes('||') ? `!(${trimmed})` : `!${trimmed}`
    }

    function getIndent(node: Rule.Node): string { return ' '.repeat(node.loc?.start.column ?? 0) }
    function isMultiLine(node: Rule.Node): boolean { return node.loc != null && node.loc.start.line !== node.loc.end.line }

    function formatReturnStatement(returnText: string, indent: string): string { /* If return statement is multi-line, wrap in block */
      return returnText.includes('\n') ? `{\n${indent}  ${returnText}\n${indent}}` : returnText
    }

    return {
      IfStatement(node: any) { /* eslint-disable ts/no-unsafe-member-access, ts/no-unsafe-assignment, ts/no-unsafe-argument */
        if (node.alternate != null || node.parent?.type !== 'BlockStatement' || !isFunctionBody(node.parent) || node.consequent?.type !== 'BlockStatement') return
        const {parent} = node
        if (parent.parent?.type === 'IfStatement' && parent.parent.alternate === node) return /* Skip if already processed */

        const blockBody = node.consequent.body as Rule.Node[]
        if (blockBody.length < minStatements) return

        const parentBody = parent.body as Rule.Node[]
        const ifIndex = parentBody.indexOf(node)
        const statementsAfter = parentBody.slice(ifIndex + 1).filter(s => s.type !== 'EmptyStatement')

        if (statementsAfter.length === 1 && statementsAfter[0]?.type === 'ReturnStatement') { /* Case 1: if block followed by single return statement */
          const returnNode = statementsAfter[0]
          if (isMultiLine(returnNode)) return
          const lastBlockStmt = blockBody.at(-1)

          context.report({
            node,
            messageId: 'preferGuardClause',
            fix(fixer) {
              const indent = getIndent(node)
              const returnText = sourceCode.getText(returnNode)
              const bodyText = blockBody.map(s => sourceCode.getText(s)).join(`\n${indent}`)
              const formattedReturn = formatReturnStatement(returnText, indent)
              const result = lastBlockStmt?.type === 'ReturnStatement' ? `if (${invertCondition(sourceCode.getText(node.test))}) ${formattedReturn}\n\n${indent}${bodyText}` : `if (${invertCondition(sourceCode.getText(node.test))}) ${formattedReturn}\n\n${indent}${bodyText}\n${indent}${returnText}`

              const nodeRange = node.range as [number, number]
              return fixer.replaceTextRange([nodeRange[0], returnNode.range![1]], result)
            }
          })
          return
        }

        if (statementsAfter.length !== 0) return /* Case 2: if block is last statement in function */
        const lastStmt = blockBody.at(-1)
        if (lastStmt == null) return
        const endsWithReturn = lastStmt.type === 'ReturnStatement'
        let defaultReturnText = 'return'

        const funcParent = parent.parent
        if (funcParent?.returnType != null) {
          const returnTypeText = sourceCode.getText(funcParent.returnType)
          if (!/^\s*:\s*(?:void|undefined)\s*$/.test(returnTypeText)) {
            if (endsWithReturn && (lastStmt as any).argument != null) defaultReturnText = `return ${sourceCode.getText((lastStmt as any).argument)}`
            else return /* Can't safely transform - we don't know what to return */
          }
        }

        context.report({
          node,
          messageId: 'preferGuardClause',
          fix(fixer) {
            const invertedCondition = invertCondition(sourceCode.getText(node.test))
            const indent = getIndent(node)
            if (endsWithReturn) {
              const statementsWithoutReturn = blockBody.slice(0, -1)
              if (statementsWithoutReturn.length === 0) return fixer.replaceText(node, `if (${invertedCondition}) ${defaultReturnText}`)
              const bodyText = statementsWithoutReturn.map(s => sourceCode.getText(s)).join(`\n${indent}`)
              return fixer.replaceText(node, `if (${invertedCondition}) ${defaultReturnText}\n\n${indent}${bodyText}`)
            }
            const bodyText = blockBody.map(s => sourceCode.getText(s)).join(`\n${indent}`)
            return fixer.replaceText(node, `if (${invertedCondition}) ${defaultReturnText}\n\n${indent}${bodyText}`)
          }
        })
      }
    }
  }
}

export default rule

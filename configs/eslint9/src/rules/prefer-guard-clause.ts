import type { Rule } from 'eslint'

interface RuleOptions {
  minStatements?: number
}

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer guard clauses (early returns) to reduce nesting',
      recommended: false,
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          minStatements: {
            type: 'number',
            default: 2,
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      preferGuardClause: 'Prefer guard clause with early return to reduce nesting',
    },
  },
  create(context) {
    const { sourceCode } = context
    const options = (context.options[0] ?? {}) as RuleOptions
    const minStatements = options.minStatements ?? 2

    function isFunctionBody(node: Rule.Node): boolean {
      const { parent } = node
      if (parent == null) return false
      return parent.type === 'FunctionDeclaration'
        || parent.type === 'FunctionExpression'
        || parent.type === 'ArrowFunctionExpression'
    }

    function invertCondition(conditionText: string): string {
      const trimmed = conditionText.trim()

      if (trimmed.startsWith('!') && !trimmed.startsWith('!=')) {
        const inner = trimmed.slice(1).trim()
        if (inner.startsWith('(') && inner.endsWith(')')) return inner.slice(1, -1)
        return inner
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

      if (trimmed.includes('&&') || trimmed.includes('||')) return `!(${trimmed})`

      return `!${trimmed}`
    }

    function getIndent(node: Rule.Node): string {
      return ' '.repeat(node.loc?.start.column ?? 0)
    }

    function isMultiLine(node: Rule.Node): boolean {
      return node.loc != null && node.loc.start.line !== node.loc.end.line
    }

    function formatReturnStatement(returnText: string, indent: string): string {
      // If return statement is multi-line, wrap in block
      if (returnText.includes('\n')) return `{\n${indent}  ${returnText}\n${indent}}`
      return returnText
    }

    return {
      /* eslint-disable ts/no-unsafe-member-access, ts/no-unsafe-assignment, ts/no-unsafe-argument */
      IfStatement(node: any) {
        // Skip if has else branch
        if (node.alternate != null) return

        // Skip if already processed as part of if-else chain
        const { parent } = node
        if (parent?.type === 'IfStatement' && parent.alternate === node) return

        // Must be in a block
        if (parent?.type !== 'BlockStatement') return

        // Must be in function body
        if (!isFunctionBody(parent)) return

        // Consequent must be a block
        if (node.consequent?.type !== 'BlockStatement') return

        const blockBody = node.consequent.body as Rule.Node[]
        if (blockBody.length < minStatements) return

        // Get statements after if
        const parentBody = parent.body as Rule.Node[]
        const ifIndex = parentBody.indexOf(node)
        const statementsAfter = parentBody.slice(ifIndex + 1).filter(s => s.type !== 'EmptyStatement')

        // Case 1: if block followed by single return statement
        if (statementsAfter.length === 1 && statementsAfter[0]?.type === 'ReturnStatement') {
          const returnNode = statementsAfter[0]

          // Skip if return statement is multi-line (complex return)
          if (isMultiLine(returnNode)) return

          context.report({
            node,
            messageId: 'preferGuardClause',
            fix(fixer) {
              const conditionText = sourceCode.getText(node.test)
              const invertedCondition = invertCondition(conditionText)
              const indent = getIndent(node)
              const returnText = sourceCode.getText(returnNode)

              const bodyText = blockBody
                .map(stmt => sourceCode.getText(stmt))
                .join(`\n${indent}`)

              const formattedReturn = formatReturnStatement(returnText, indent)
              // After guard clause, we need to keep the original return at the end
              const result = `if (${invertedCondition}) ${formattedReturn}\n\n${indent}${bodyText}\n${indent}${returnText}`

              const nodeRange = node.range as [number, number] | undefined
              const returnRange = returnNode.range
              if (nodeRange == null || returnRange == null) return null

              return fixer.replaceTextRange([nodeRange[0], returnRange[1]], result)
            },
          })
          return
        }

        // Case 2: if block is last statement in function
        if (statementsAfter.length !== 0) return

        const lastStmt = blockBody.at(-1)
        if (lastStmt == null) return
        const endsWithReturn = lastStmt.type === 'ReturnStatement'

        // Check if function has explicit return type or returns a value
        // by looking at the parent function
        const funcParent = parent.parent
        let defaultReturnText = 'return'

        if (funcParent != null) {
          // Check if function has return type annotation
          const { returnType } = funcParent
          if (returnType != null) {
            const returnTypeText = sourceCode.getText(returnType)
            // If return type is not void/undefined, we can't just use 'return'
            if (!/^\s*:\s*(?:void|undefined)\s*$/.test(returnTypeText)) {
              // We need to find what value to return
              // If the if block ends with return, use that
              if (endsWithReturn) {
                const returnStmt = lastStmt as any
                if (returnStmt.argument != null) defaultReturnText = `return ${sourceCode.getText(returnStmt.argument)}`
              } else {
                // Can't safely transform - we don't know what to return
                return
              }
            }
          }
        }

        context.report({
          node,
          messageId: 'preferGuardClause',
          fix(fixer) {
            const conditionText = sourceCode.getText(node.test)
            const invertedCondition = invertCondition(conditionText)
            const indent = getIndent(node)

            if (endsWithReturn) {
              const statementsWithoutReturn = blockBody.slice(0, -1)
              if (statementsWithoutReturn.length === 0) return fixer.replaceText(node, `if (${invertedCondition}) ${defaultReturnText}`)
              const bodyText = statementsWithoutReturn
                .map(stmt => sourceCode.getText(stmt))
                .join(`\n${indent}`)
              return fixer.replaceText(node, `if (${invertedCondition}) ${defaultReturnText}\n\n${indent}${bodyText}`)
            }

            const bodyText = blockBody
              .map(stmt => sourceCode.getText(stmt))
              .join(`\n${indent}`)
            return fixer.replaceText(node, `if (${invertedCondition}) ${defaultReturnText}\n\n${indent}${bodyText}`)
          },
        })
      },
    }
  },
}

export default rule

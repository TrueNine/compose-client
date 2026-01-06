import type { Rule } from 'eslint'

const MAX_LINE_LENGTH = 160

const rule: Rule.RuleModule = {
  meta: {
    type: 'layout',
    docs: {
      description: 'Prefer single-line if statements when possible',
      recommended: false,
    },
    fixable: 'code',
    schema: [],
    messages: {
      preferSingleLine: 'If-else chain with simple statements should be single-line format',
    },
  },
  create(context) {
    const sourceCode = context.sourceCode

    function getSingleStatement(node: Rule.Node | null | undefined): Rule.Node | null {
      if (!node) return null
      if (node.type === 'BlockStatement' && 'body' in node) {
        const body = node.body as Rule.Node[]
        if (body.length === 1) return body[0]
        return null
      }
      return node
    }

    function isSimpleStatement(stmt: Rule.Node | null): boolean {
      if (!stmt) return false
      return stmt.type === 'ExpressionStatement'
        || stmt.type === 'ReturnStatement'
        || stmt.type === 'ThrowStatement'
        || stmt.type === 'BreakStatement'
        || stmt.type === 'ContinueStatement'
    }

    function isNodeSingleLine(node: Rule.Node): boolean {
      return node.loc?.start.line === node.loc?.end.line
    }

    function collectIfChain(node: Rule.Node): { conditions: Rule.Node[], finalElse: Rule.Node | null } {
      const conditions: Rule.Node[] = []
      let current: Rule.Node | null = node

      while (current && current.type === 'IfStatement') {
        conditions.push(current)
        current = ('alternate' in current ? current.alternate : null) as Rule.Node | null
      }

      return { conditions, finalElse: current }
    }

    function canConvertToSingleLine(node: Rule.Node): boolean {
      const { conditions, finalElse } = collectIfChain(node)

      for (const cond of conditions) {
        if (!('consequent' in cond) || !('test' in cond)) return false

        // Check if condition itself spans multiple lines
        const test = cond.test as Rule.Node
        if (!isNodeSingleLine(test)) return false

        const stmt = getSingleStatement(cond.consequent as Rule.Node)
        if (!stmt || !isSimpleStatement(stmt)) return false

        // Check if statement spans multiple lines
        if (!isNodeSingleLine(stmt)) return false
      }

      if (finalElse) {
        const stmt = getSingleStatement(finalElse)
        if (!stmt || !isSimpleStatement(stmt)) return false
        if (!isNodeSingleLine(stmt)) return false
      }

      const lines: string[] = []
      for (let i = 0; i < conditions.length; i++) {
        const cond = conditions[i]
        if (!('consequent' in cond) || !('test' in cond)) continue
        const stmt = getSingleStatement(cond.consequent as Rule.Node)!
        const condText = sourceCode.getText(cond.test as Rule.Node)
        const stmtText = sourceCode.getText(stmt)
        const prefix = i === 0 ? 'if' : 'else if'
        lines.push(`${prefix} (${condText}) ${stmtText}`)
      }

      if (finalElse) {
        const stmt = getSingleStatement(finalElse)!
        lines.push(`else ${sourceCode.getText(stmt)}`)
      }

      return lines.every(line => line.length < MAX_LINE_LENGTH - 20)
    }

    function isAlreadySingleLine(node: Rule.Node): boolean {
      const { conditions, finalElse } = collectIfChain(node)

      for (const cond of conditions) {
        if (!('consequent' in cond)) return false
        const consequent = cond.consequent as Rule.Node
        if (consequent.type === 'BlockStatement') return false
      }

      if (finalElse && finalElse.type === 'BlockStatement') return false

      for (const cond of conditions) {
        if (!('consequent' in cond)) return false
        const consequent = cond.consequent as Rule.Node
        const startLine = cond.loc?.start.line
        const endLine = consequent.loc?.end.line
        if (startLine !== endLine) return false
      }

      return true
    }

    return {
      IfStatement(node) {
        const parent = node.parent
        if (parent?.type === 'IfStatement' && 'alternate' in parent && parent.alternate === node) return

        if (isAlreadySingleLine(node)) return
        if (!canConvertToSingleLine(node)) return

        context.report({
          node,
          messageId: 'preferSingleLine',
          fix(fixer) {
            const { conditions, finalElse } = collectIfChain(node)
            const indent = ' '.repeat(node.loc?.start.column ?? 0)
            const lines: string[] = []

            for (let i = 0; i < conditions.length; i++) {
              const cond = conditions[i]
              if (!('consequent' in cond) || !('test' in cond)) continue
              const stmt = getSingleStatement(cond.consequent as Rule.Node)!
              const condText = sourceCode.getText(cond.test as Rule.Node)
              let stmtText = sourceCode.getText(stmt)

              if (!stmtText.endsWith(';') && !stmtText.endsWith('}')) stmtText = stmtText.trimEnd()

              const prefix = i === 0 ? 'if' : `${indent}else if`
              lines.push(`${prefix} (${condText}) ${stmtText}`)
            }

            if (finalElse) {
              const stmt = getSingleStatement(finalElse)!
              let stmtText = sourceCode.getText(stmt)
              if (!stmtText.endsWith(';') && !stmtText.endsWith('}')) stmtText = stmtText.trimEnd()
              lines.push(`${indent}else ${stmtText}`)
            }

            return fixer.replaceText(node, lines.join('\n'))
          },
        })
      },
    }
  },
}

export default rule

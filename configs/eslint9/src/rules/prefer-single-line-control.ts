import type { Rule } from 'eslint'

const MAX_LINE_LENGTH = 160

const rule: Rule.RuleModule = {
  meta: {
    type: 'layout',
    docs: {
      description: 'Prefer single-line switch cases, for loops, and while loops when possible',
      recommended: false,
    },
    fixable: 'code',
    schema: [],
    messages: {
      preferSingleLineCase: 'Switch case with simple statement should be single-line format',
      preferSingleLineFor: 'For loop with simple body should be single-line format',
      preferSingleLineWhile: 'While loop with simple body should be single-line format',
    },
  },
  create(context) {
    const { sourceCode } = context

    /* eslint-disable ts/no-unsafe-assignment */
    function getSingleStatement(node: Rule.Node | null | undefined): Rule.Node | null {
      if (!node) return null
      if (node.type !== 'BlockStatement') return node

      const { body } = node as any
      if (!Array.isArray(body) || body.length !== 1) return null
      return body[0] as Rule.Node
    }

    function hasComments(node: Rule.Node): boolean {
      const comments = sourceCode.getCommentsInside(node)
      return comments.length > 0
    }
    /* eslint-enable ts/no-unsafe-assignment */

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

    function normalizeText(text: string): string {
      return text.split('\n').map(line => line.trim()).join(' ').replace(/\s+/g, ' ').trim()
    }


    // ==================== Switch Case ====================
    function canCaseBeSimplified(caseNode: Rule.Node): boolean {
      const { consequent } = caseNode as any
      if (!Array.isArray(consequent) || consequent.length === 0) return false

      // 只有一个语句，或者一个语句 + break
      const stmts = consequent as Rule.Node[]
      if (stmts.length > 2) return false

      const mainStmt = stmts[0]
      if (!isSimpleStatement(mainStmt)) return false
      if (!isNodeSingleLine(mainStmt)) return false

      // 如果有第二个语句，必须是 break
      if (stmts.length === 2) {
        const second = stmts[1]
        if (second.type !== 'BreakStatement') return false
      }

      if (hasComments(caseNode)) return false

      const testNode = (caseNode as any).test
      const testText = testNode ? normalizeText(sourceCode.getText(testNode)) : 'default'
      const stmtText = sourceCode.getText(mainStmt)
      const hasBreak = stmts.length === 2 || mainStmt.type === 'ReturnStatement' || mainStmt.type === 'ThrowStatement'
      const breakText = (stmts.length === 2 && stmts[1].type === 'BreakStatement') ? ' break' : ''

      const lineLength = `case ${testText}: ${stmtText}${breakText}`.length
      return lineLength < MAX_LINE_LENGTH
    }

    function isCaseAlreadySingleLine(caseNode: Rule.Node): boolean {
      return caseNode.loc?.start.line === caseNode.loc?.end.line
    }

    // ==================== For/While Loops ====================
    function canLoopBeSimplified(loopNode: Rule.Node): boolean {
      const body = (loopNode as any).body as Rule.Node
      if (!body) return false
      if (body.type !== 'BlockStatement') return false
      if (hasComments(body)) return false

      const stmt = getSingleStatement(body)
      if (!stmt || !isSimpleStatement(stmt)) return false
      if (!isNodeSingleLine(stmt)) return false

      // 获取循环头部文本
      const loopText = sourceCode.getText(loopNode)
      const bodyStart = body.range?.[0] ?? 0
      const loopStart = loopNode.range?.[0] ?? 0
      const headerText = normalizeText(loopText.slice(0, bodyStart - loopStart))
      const stmtText = sourceCode.getText(stmt)

      const lineLength = `${headerText} ${stmtText}`.length
      return lineLength < MAX_LINE_LENGTH
    }

    function isLoopAlreadySingleLine(loopNode: Rule.Node): boolean {
      const body = (loopNode as any).body as Rule.Node
      if (!body) return false
      if (body.type === 'BlockStatement') return false
      return loopNode.loc?.start.line === body.loc?.end.line
    }

    return {
      SwitchStatement(node) {
        const cases = (node as any).cases as Rule.Node[]
        if (!cases || cases.length === 0) return

        const simplifiableCases: number[] = []
        for (let i = 0; i < cases.length; i++) {
          const caseNode = cases[i]
          if (!isCaseAlreadySingleLine(caseNode) && canCaseBeSimplified(caseNode)) {
            simplifiableCases.push(i)
          }
        }

        if (simplifiableCases.length === 0) return

        // 逐个报告可简化的 case
        for (const idx of simplifiableCases) {
          const caseNode = cases[idx]
          context.report({
            node: caseNode,
            messageId: 'preferSingleLineCase',
            fix(fixer) {
              const { test, consequent } = caseNode as any
              const stmts = consequent as Rule.Node[]
              const mainStmt = stmts[0]
              const stmtText = sourceCode.getText(mainStmt).trimEnd()

              let caseText: string
              if (test) {
                const testText = normalizeText(sourceCode.getText(test))
                caseText = `case ${testText}:`
              } else {
                caseText = 'default:'
              }

              // 检查是否需要 break
              const hasBreak = stmts.length === 2 && stmts[1].type === 'BreakStatement'
              const breakText = hasBreak ? ' break' : ''

              return fixer.replaceText(caseNode, `${caseText} ${stmtText}${breakText}`)
            },
          })
        }
      },

      ForStatement(node) {
        if (isLoopAlreadySingleLine(node)) return
        if (!canLoopBeSimplified(node)) return

        context.report({
          node,
          messageId: 'preferSingleLineFor',
          fix(fixer) {
            const body = (node as any).body as Rule.Node
            const stmt = getSingleStatement(body)!
            const stmtText = sourceCode.getText(stmt).trimEnd()

            const loopText = sourceCode.getText(node)
            const bodyStart = body.range?.[0] ?? 0
            const loopStart = node.range?.[0] ?? 0
            const headerText = normalizeText(loopText.slice(0, bodyStart - loopStart))

            return fixer.replaceText(node, `${headerText} ${stmtText}`)
          },
        })
      },

      ForInStatement(node) {
        if (isLoopAlreadySingleLine(node)) return
        if (!canLoopBeSimplified(node)) return

        context.report({
          node,
          messageId: 'preferSingleLineFor',
          fix(fixer) {
            const body = (node as any).body as Rule.Node
            const stmt = getSingleStatement(body)!
            const stmtText = sourceCode.getText(stmt).trimEnd()

            const loopText = sourceCode.getText(node)
            const bodyStart = body.range?.[0] ?? 0
            const loopStart = node.range?.[0] ?? 0
            const headerText = normalizeText(loopText.slice(0, bodyStart - loopStart))

            return fixer.replaceText(node, `${headerText} ${stmtText}`)
          },
        })
      },

      ForOfStatement(node) {
        if (isLoopAlreadySingleLine(node)) return
        if (!canLoopBeSimplified(node)) return

        context.report({
          node,
          messageId: 'preferSingleLineFor',
          fix(fixer) {
            const body = (node as any).body as Rule.Node
            const stmt = getSingleStatement(body)!
            const stmtText = sourceCode.getText(stmt).trimEnd()

            const loopText = sourceCode.getText(node)
            const bodyStart = body.range?.[0] ?? 0
            const loopStart = node.range?.[0] ?? 0
            const headerText = normalizeText(loopText.slice(0, bodyStart - loopStart))

            return fixer.replaceText(node, `${headerText} ${stmtText}`)
          },
        })
      },

      WhileStatement(node) {
        if (isLoopAlreadySingleLine(node)) return
        if (!canLoopBeSimplified(node)) return

        context.report({
          node,
          messageId: 'preferSingleLineWhile',
          fix(fixer) {
            const body = (node as any).body as Rule.Node
            const stmt = getSingleStatement(body)!
            const stmtText = sourceCode.getText(stmt).trimEnd()

            const test = (node as any).test as Rule.Node
            const testText = normalizeText(sourceCode.getText(test))

            return fixer.replaceText(node, `while (${testText}) ${stmtText}`)
          },
        })
      },

      DoWhileStatement(node) {
        // do-while 结构特殊，暂不处理
      },
    }
  },
}

export default rule

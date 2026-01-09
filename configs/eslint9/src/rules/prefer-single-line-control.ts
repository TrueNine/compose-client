import type {Rule} from 'eslint'

const MAX_LINE_LENGTH = 160

const rule: Rule.RuleModule = {
  meta: {
    type: 'layout',
    docs: {
      description: 'Prefer single-line switch cases, for loops, while loops, and try-catch when possible',
      recommended: false,
    },
    fixable: 'code',
    schema: [],
    messages: {
      preferSingleLineCase: 'Switch case with simple statement should be single-line format',
      preferSingleLineFor: 'For loop with simple body should be single-line format',
      preferSingleLineWhile: 'While loop with simple body should be single-line format',
      preferSingleLineTry: 'Try-catch with simple bodies should be single-line format',
    },
  },
  create(context) {
    const {sourceCode} = context

    function getSingleStatement(node: Rule.Node | null | undefined): Rule.Node | null {
      if (!node) return null
      if (node.type !== 'BlockStatement') return node

      const blockNode = node as Rule.Node & {body: Rule.Node[]}
      const {body} = blockNode
      if (!Array.isArray(body) || body.length !== 1) return null
      return body[0]
    }

    function hasComments(node: Rule.Node): boolean {
      const comments = sourceCode.getCommentsInside(node)
      return comments.length > 0
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

    function normalizeText(text: string): string {
      return text.split('\n').map(line => line.trim()).join(' ').replaceAll(/\s+/g, ' ').trim()
    }

    // 确保语句以分号结尾
    function ensureSemicolon(text: string): string {
      const trimmed = text.trimEnd()
      return trimmed.endsWith(';') ? trimmed : `${trimmed};`
    }

    // ==================== Switch Case ====================
    type CaseNode = Rule.Node & {test: Rule.Node | null, consequent: Rule.Node[]}
    type SwitchNode = Rule.Node & {cases: CaseNode[]}
    type LoopNode = Rule.Node & {body: Rule.Node}
    type WhileNode = LoopNode & {test: Rule.Node}

    // 从 case 的 consequent 中提取语句和 break
    function extractCaseStatements(consequent: Rule.Node[]): {mainStmt: Rule.Node | null, hasBreak: boolean} {
      if (!Array.isArray(consequent) || consequent.length === 0) return {mainStmt: null, hasBreak: false}

      // 情况1: case x: stmt (单语句) 或 case x: stmt; break (语句+break)
      if (consequent.length === 1) {
        const first = consequent[0]
        if (isSimpleStatement(first)) return {mainStmt: first, hasBreak: false}
      }
      if (consequent.length === 2) {
        const first = consequent[0]
        const second = consequent[1]
        // 只有当第二条是 break 时才能简化
        if (isSimpleStatement(first) && second.type === 'BreakStatement') return {mainStmt: first, hasBreak: true}
      }

      // 情况2: case x: { stmt; break } (BlockStatement)
      if (consequent.length !== 1 || consequent[0].type !== 'BlockStatement') return {mainStmt: null, hasBreak: false}

      const block = consequent[0] as Rule.Node & {body: Rule.Node[]}
      const {body} = block
      if (!Array.isArray(body) || body.length === 0 || body.length > 2) return {mainStmt: null, hasBreak: false}
      const first = body[0]
      if (!isSimpleStatement(first)) return {mainStmt: null, hasBreak: false}
      const hasBreak = body.length === 2 && body[1].type === 'BreakStatement'
      if (body.length === 1 || hasBreak) return {mainStmt: first, hasBreak}
      return {mainStmt: null, hasBreak: false}
    }

    function canCaseBeSimplified(caseNode: CaseNode): boolean {
      const {consequent} = caseNode
      if (!Array.isArray(consequent) || consequent.length === 0) return false

      const {mainStmt, hasBreak} = extractCaseStatements(consequent)
      if (!mainStmt) return false
      if (!isNodeSingleLine(mainStmt)) return false

      if (hasComments(caseNode)) return false

      const {test} = caseNode
      const testText = test != null ? normalizeText(sourceCode.getText(test)) : 'default'
      const stmtText = ensureSemicolon(sourceCode.getText(mainStmt))
      const breakText = hasBreak ? ' break' : ''

      const lineLength = `case ${testText}: ${stmtText}${breakText}`.length
      return lineLength < MAX_LINE_LENGTH
    }

    function isCaseAlreadySingleLine(caseNode: CaseNode): boolean {
      return caseNode.loc?.start.line === caseNode.loc?.end.line
    }

    // ==================== For/While Loops ====================
    function canLoopBeSimplified(loopNode: LoopNode): boolean {
      const {body} = loopNode
      if (body == null) return false
      if (body.type !== 'BlockStatement') return false
      if (hasComments(body)) return false

      const stmt = getSingleStatement(body)
      if (!stmt || !isSimpleStatement(stmt)) return false
      if (!isNodeSingleLine(stmt)) return false

      const loopText = sourceCode.getText(loopNode)
      const bodyStart = body.range?.[0] ?? 0
      const loopStart = loopNode.range?.[0] ?? 0
      const headerText = normalizeText(loopText.slice(0, bodyStart - loopStart))
      const stmtText = sourceCode.getText(stmt)

      const lineLength = `${headerText} ${stmtText}`.length
      return lineLength < MAX_LINE_LENGTH
    }

    function isLoopAlreadySingleLine(loopNode: LoopNode): boolean {
      const {body} = loopNode
      if (body == null) return false
      if (body.type === 'BlockStatement') return false
      return loopNode.loc?.start.line === body.loc?.end.line
    }

    // ==================== Try-Catch ====================
    type TryNode = Rule.Node & {
      block: Rule.Node & {body: Rule.Node[]}
      handler: (Rule.Node & {param: Rule.Node | null, body: Rule.Node & {body: Rule.Node[]}}) | null
      finalizer: (Rule.Node & {body: Rule.Node[]}) | null
    }

    function canTryBeSimplified(tryNode: TryNode): boolean {
      const {block, handler, finalizer} = tryNode

      // try block 必须是单条简单语句
      const tryStmt = getSingleStatement(block)
      if (!tryStmt || !isSimpleStatement(tryStmt)) return false
      if (!isNodeSingleLine(tryStmt)) return false
      if (hasComments(block)) return false

      // catch block（如果存在）必须是单条简单语句
      if (handler) {
        const catchStmt = getSingleStatement(handler.body)
        if (!catchStmt || !isSimpleStatement(catchStmt)) return false
        if (!isNodeSingleLine(catchStmt)) return false
        if (hasComments(handler.body)) return false
      }

      // finally block（如果存在）必须是单条简单语句
      if (finalizer) {
        const finallyStmt = getSingleStatement(finalizer)
        if (!finallyStmt || !isSimpleStatement(finallyStmt)) return false
        if (!isNodeSingleLine(finallyStmt)) return false
        if (hasComments(finalizer)) return false
      }

      // 必须有 catch 或 finally
      if (!handler && !finalizer) return false

      // 检查每行长度
      const tryText = ensureSemicolon(sourceCode.getText(tryStmt))
      if (`try { ${tryText} }`.length >= MAX_LINE_LENGTH) return false

      if (handler) {
        const catchParam = handler.param
        const catchParamText = catchParam ? sourceCode.getText(catchParam) : ''
        const catchStmt = getSingleStatement(handler.body)!
        const catchText = ensureSemicolon(sourceCode.getText(catchStmt))
        const catchLine = catchParam ? `catch (${catchParamText}) { ${catchText} }` : `catch { ${catchText} }`
        if (catchLine.length >= MAX_LINE_LENGTH) return false
      }

      if (!finalizer) return true

      const finallyStmt = getSingleStatement(finalizer)!
      const finallyText = ensureSemicolon(sourceCode.getText(finallyStmt))
      if (`finally { ${finallyText} }`.length >= MAX_LINE_LENGTH) return false
      return true
    }

    function isTryAlreadyCompact(tryNode: TryNode): boolean {
      const {block, handler, finalizer} = tryNode

      // 检查 try 块是否已经是单行格式 try { ... }
      const tryStmt = getSingleStatement(block)
      // 不是单语句，不处理
      if (!tryStmt) return true
      if (block.loc?.start.line !== block.loc?.end.line) return false

      // 检查 catch 块
      if (handler) {
        const catchStmt = getSingleStatement(handler.body)
        if (!catchStmt) return true
        if (handler.body.loc?.start.line !== handler.body.loc?.end.line) return false
      }

      // 检查 finally 块
      if (!finalizer) return true

      const finallyStmt = getSingleStatement(finalizer)
      if (!finallyStmt) return true
      if (finalizer.loc?.start.line !== finalizer.loc?.end.line) return false
      return true
    }

    return {
      SwitchStatement(node) {
        const switchNode = node as SwitchNode
        const {cases} = switchNode
        if (cases == null || cases.length === 0) return

        const simplifiableCases: number[] = []
        for (let i = 0; i < cases.length; i++) {
          const caseNode = cases[i]
          if (!isCaseAlreadySingleLine(caseNode) && canCaseBeSimplified(caseNode)) simplifiableCases.push(i)
        }

        if (simplifiableCases.length === 0) return

        for (const idx of simplifiableCases) {
          const caseNode = cases[idx]
          context.report({
            node: caseNode,
            messageId: 'preferSingleLineCase',
            fix(fixer) {
              const {test, consequent} = caseNode
              const {mainStmt, hasBreak} = extractCaseStatements(consequent)
              if (!mainStmt) return null

              const stmtText = ensureSemicolon(sourceCode.getText(mainStmt))

              let caseText: string
              if (test != null) {
                const testText = normalizeText(sourceCode.getText(test))
                caseText = `case ${testText}:`
              }
              else caseText = 'default:'

              const breakText = hasBreak ? ' break' : ''

              return fixer.replaceText(caseNode, `${caseText} ${stmtText}${breakText}`)
            },
          })
        }
      },

      ForStatement(node) {
        const loopNode = node as LoopNode
        if (isLoopAlreadySingleLine(loopNode)) return
        if (!canLoopBeSimplified(loopNode)) return

        context.report({
          node,
          messageId: 'preferSingleLineFor',
          fix(fixer) {
            const {body} = loopNode
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
        const loopNode = node as LoopNode
        if (isLoopAlreadySingleLine(loopNode)) return
        if (!canLoopBeSimplified(loopNode)) return

        context.report({
          node,
          messageId: 'preferSingleLineFor',
          fix(fixer) {
            const {body} = loopNode
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
        const loopNode = node as LoopNode
        if (isLoopAlreadySingleLine(loopNode)) return
        if (!canLoopBeSimplified(loopNode)) return

        context.report({
          node,
          messageId: 'preferSingleLineFor',
          fix(fixer) {
            const {body} = loopNode
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
        const loopNode = node as WhileNode
        if (isLoopAlreadySingleLine(loopNode)) return
        if (!canLoopBeSimplified(loopNode)) return

        context.report({
          node,
          messageId: 'preferSingleLineWhile',
          fix(fixer) {
            const {body, test} = loopNode
            const stmt = getSingleStatement(body)!
            const stmtText = sourceCode.getText(stmt).trimEnd()

            const testText = normalizeText(sourceCode.getText(test))

            return fixer.replaceText(node, `while (${testText}) ${stmtText}`)
          },
        })
      },

      DoWhileStatement() {
        // do-while 结构特殊，暂不处理
      },

      TryStatement(node) {
        const tryNode = node as TryNode
        if (isTryAlreadyCompact(tryNode)) return
        if (!canTryBeSimplified(tryNode)) return

        context.report({
          node,
          messageId: 'preferSingleLineTry',
          fix(fixer) {
            const {block, handler, finalizer} = tryNode

            // try block
            const tryStmt = getSingleStatement(block)
            if (!tryStmt) return null
            const tryText = ensureSemicolon(sourceCode.getText(tryStmt))

            let result = `try { ${tryText} }`

            // catch block (换行)
            if (handler) {
              const catchParam = handler.param
              const catchParamText = catchParam ? sourceCode.getText(catchParam) : ''
              const catchStmt = getSingleStatement(handler.body)
              if (!catchStmt) return null
              const catchText = ensureSemicolon(sourceCode.getText(catchStmt))
              result += catchParam ? `\ncatch (${catchParamText}) { ${catchText} }` : `\ncatch { ${catchText} }`
            }

            // finally block (换行)
            if (!finalizer) return fixer.replaceText(node, result)

            const finallyStmt = getSingleStatement(finalizer)
            if (!finallyStmt) return null
            const finallyText = ensureSemicolon(sourceCode.getText(finallyStmt))
            result += `\nfinally { ${finallyText} }`
            return fixer.replaceText(node, result)
          },
        })
      },
    }
  },
}

export default rule

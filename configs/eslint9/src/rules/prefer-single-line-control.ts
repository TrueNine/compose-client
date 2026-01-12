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
      preferBraceCatch: '} catch should be on the same line',
      preferBraceFinally: '} finally should be on the same line',
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

    // 检查单个块是否可以压缩成单行
    function canBlockBeCompact(block: Rule.Node & {body: Rule.Node[]}): boolean {
      const stmt = getSingleStatement(block)
      if (!stmt || !isSimpleStatement(stmt)) return false
      if (!isNodeSingleLine(stmt)) return false
      if (hasComments(block)) return false
      return true
    }

    // 检查块是否已经是单行
    function isBlockAlreadyCompact(block: Rule.Node & {body: Rule.Node[]}): boolean {
      return block.loc?.start.line === block.loc?.end.line
    }

    // 生成压缩后的块文本
    function getCompactBlockText(block: Rule.Node & {body: Rule.Node[]}): string {
      const stmt = getSingleStatement(block)!
      return `{ ${ensureSemicolon(sourceCode.getText(stmt))} }`
    }

    // 检查压缩后的 catch 行长度
    function getCatchLineLength(handler: TryNode['handler']): number {
      if (!handler) return 0
      const catchParam = handler.param
      const catchParamText = catchParam ? sourceCode.getText(catchParam) : ''
      const stmt = getSingleStatement(handler.body)!
      const stmtText = ensureSemicolon(sourceCode.getText(stmt))
      return catchParam ? `catch (${catchParamText}) { ${stmtText} }`.length : `catch { ${stmtText} }`.length
    }

    // 检查压缩后的 finally 行长度
    function getFinallyLineLength(finalizer: TryNode['finalizer']): number {
      if (!finalizer) return 0
      const stmt = getSingleStatement(finalizer)!
      const stmtText = ensureSemicolon(sourceCode.getText(stmt))
      return `finally { ${stmtText} }`.length
    }

    // 检查压缩后的 try 行长度
    function getTryLineLength(block: Rule.Node & {body: Rule.Node[]}): number {
      const stmt = getSingleStatement(block)!
      const stmtText = ensureSemicolon(sourceCode.getText(stmt))
      return `try { ${stmtText} }`.length
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
        const {block, handler, finalizer} = tryNode

        // 检查是否需要任何修复
        const canCompactTry = canBlockBeCompact(block) && !isBlockAlreadyCompact(block)
        const canCompactCatch = handler && canBlockBeCompact(handler.body) && !isBlockAlreadyCompact(handler.body)
        const canCompactFinally = finalizer && canBlockBeCompact(finalizer) && !isBlockAlreadyCompact(finalizer)

        // 检查各部分是否在同一行（需要拆分）
        const tryEndLine = block.loc!.end.line
        const catchStartLine = handler?.loc!.start.line
        const catchEndLine = handler?.body.loc!.end.line
        const finallyStartLine = finalizer?.loc!.start.line

        // try 和 catch 在同一行
        const tryCatchSameLine = handler && tryEndLine === catchStartLine
        // catch 和 finally 在同一行
        const catchFinallySameLine = handler && finalizer && catchEndLine === finallyStartLine
        // try 和 finally 在同一行（没有 catch 的情况）
        const tryFinallySameLine = !handler && finalizer && tryEndLine === finallyStartLine

        // 如果没有任何需要修复的，跳过
        if (!canCompactTry && !canCompactCatch && !canCompactFinally && !tryCatchSameLine && !catchFinallySameLine && !tryFinallySameLine) return

        context.report({
          node,
          messageId: 'preferSingleLineTry',
          fix(fixer) {
            const lines: string[] = []

            // try 块 - 独立一行
            if ((canCompactTry || isBlockAlreadyCompact(block)) && getTryLineLength(block) < MAX_LINE_LENGTH) lines.push(`try ${getCompactBlockText(block)}`)
            else lines.push(`try ${sourceCode.getText(block)}`)

            // catch 块 - 独立一行
            if (handler) {
              const catchParam = handler.param
              const catchParamText = catchParam ? `(${sourceCode.getText(catchParam)}) ` : ''
              if ((canCompactCatch || isBlockAlreadyCompact(handler.body)) && getCatchLineLength(handler) < MAX_LINE_LENGTH) lines.push(`catch ${catchParamText}${getCompactBlockText(handler.body)}`)
              else lines.push(`catch ${catchParamText}${sourceCode.getText(handler.body)}`)
            }

            // finally 块 - 独立一行
            if (finalizer) {
              if ((canCompactFinally || isBlockAlreadyCompact(finalizer)) && getFinallyLineLength(finalizer) < MAX_LINE_LENGTH) lines.push(`finally ${getCompactBlockText(finalizer)}`)
              else lines.push(`finally ${sourceCode.getText(finalizer)}`)
            }

            return fixer.replaceText(node, lines.join('\n'))
          },
        })
      },
    }
  },
}

export default rule

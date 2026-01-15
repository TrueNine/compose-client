import type {Rule} from 'eslint'

const MAX_LINE_LENGTH = 160

/**
 * ESLint rule: prefer-single-line-control
 * Prefer single-line switch cases, for loops, while loops, and try-catch when possible.
 */
const rule: Rule.RuleModule = {
  meta: {
    type: 'layout',
    docs: {description: 'Prefer single-line switch cases, for loops, while loops, and try-catch when possible', recommended: false},
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
      const {body} = node as Rule.Node & {body: Rule.Node[]}
      return Array.isArray(body) && body.length === 1 ? body[0] : null
    }

    function hasComments(node: Rule.Node): boolean { return sourceCode.getCommentsInside(node).length > 0 }

    function isSimpleStatement(stmt: Rule.Node | null): boolean {
      if (!stmt) return false
      return new Set(['ExpressionStatement', 'ReturnStatement', 'ThrowStatement', 'BreakStatement', 'ContinueStatement']).has(stmt.type)
    }

    function isNodeSingleLine(node: Rule.Node): boolean { return node.loc?.start.line === node.loc?.end.line }
    function normalizeText(text: string): string { return text.split('\n').map(l => l.trim()).join(' ').replaceAll(/\s+/g, ' ').trim() }
    function ensureSemicolon(text: string): string { return text.trimEnd().endsWith(';') ? text.trimEnd() : `${text.trimEnd()};` }

    type CaseNode = Rule.Node & {test: Rule.Node | null, consequent: Rule.Node[]}
    type LoopNode = Rule.Node & {body: Rule.Node}
    type WhileNode = LoopNode & {test: Rule.Node}

    function extractCaseStatements(consequent: Rule.Node[]): {mainStmt: Rule.Node | null, hasBreak: boolean} { /* 从 case 的 consequent 中提取语句和 break */
      if (!Array.isArray(consequent) || consequent.length === 0) return {mainStmt: null, hasBreak: false}
      if (consequent.length === 1) {
        if (isSimpleStatement(consequent[0])) return {mainStmt: consequent[0], hasBreak: false}
      }
      if (consequent.length === 2 && isSimpleStatement(consequent[0]) && consequent[1].type === 'BreakStatement') return {mainStmt: consequent[0], hasBreak: true}

      if (consequent.length !== 1 || consequent[0].type !== 'BlockStatement') return {mainStmt: null, hasBreak: false}
      const {body} = consequent[0] as Rule.Node & {body: Rule.Node[]}
      if (!Array.isArray(body) || body.length === 0 || body.length > 2) return {mainStmt: null, hasBreak: false}
      const hasBreak = body.length === 2 && body[1].type === 'BreakStatement'
      return (body.length === 1 || hasBreak) && isSimpleStatement(body[0]) ? {mainStmt: body[0], hasBreak} : {mainStmt: null, hasBreak: false}
    }

    function canCaseBeSimplified(caseNode: CaseNode): boolean {
      const {consequent, test} = caseNode
      const {mainStmt, hasBreak} = extractCaseStatements(consequent)
      if (!mainStmt || !isNodeSingleLine(mainStmt) || hasComments(caseNode)) return false
      const testText = test != null ? normalizeText(sourceCode.getText(test)) : 'default'
      return `case ${testText}: ${ensureSemicolon(sourceCode.getText(mainStmt))}${hasBreak ? ' break' : ''}`.length < MAX_LINE_LENGTH
    }

    function canLoopBeSimplified(loopNode: LoopNode): boolean {
      const {body} = loopNode
      if (body?.type !== 'BlockStatement' || hasComments(body)) return false
      const stmt = getSingleStatement(body)
      if (!stmt || !isSimpleStatement(stmt) || !isNodeSingleLine(stmt)) return false
      const headerText = normalizeText(sourceCode.getText(loopNode).slice(0, (body.range?.[0] ?? 0) - (loopNode.range?.[0] ?? 0)))
      return `${headerText} ${sourceCode.getText(stmt)}`.length < MAX_LINE_LENGTH
    }

    function isLoopAlreadySingleLine(l: LoopNode): boolean { return l.body == null || l.body.type === 'BlockStatement' ? false : l.loc?.start.line === l.body.loc?.end.line }

    const loopVisitor = (messageId: 'preferSingleLineFor' | 'preferSingleLineWhile') => (node: Rule.Node) => {
      const l = node as LoopNode
      if (isLoopAlreadySingleLine(l) || !canLoopBeSimplified(l)) return
      context.report({
        node,
        messageId,
        fix: fixer => {
          const stmt = getSingleStatement(l.body)!
          if (node.type === 'WhileStatement') return fixer.replaceText(node, `while (${normalizeText(sourceCode.getText((node as WhileNode).test))}) ${sourceCode.getText(stmt).trimEnd()}`)
          const h = normalizeText(sourceCode.getText(node).slice(0, (l.body.range?.[0] ?? 0) - (node.range?.[0] ?? 0)))
          return fixer.replaceText(node, `${h} ${sourceCode.getText(stmt).trimEnd()}`)
        },
      })
    }

    return {
      SwitchStatement(node) {
        const {cases} = node as Rule.Node & {cases: CaseNode[]}
        cases?.forEach(c => {
          if (c.loc?.start.line !== c.loc?.end.line && canCaseBeSimplified(c)) {
            context.report({
              node: c,
              messageId: 'preferSingleLineCase',
              fix: fixer => {
                const {mainStmt, hasBreak} = extractCaseStatements(c.consequent)
                const tText = c.test ? `case ${normalizeText(sourceCode.getText(c.test))}:` : 'default:'
                return fixer.replaceText(c, `${tText} ${ensureSemicolon(sourceCode.getText(mainStmt!))}${hasBreak ? ' break' : ''}`)
              },
            })
          }
        })
      },
      ForStatement: loopVisitor('preferSingleLineFor'),
      ForInStatement: loopVisitor('preferSingleLineFor'),
      ForOfStatement: loopVisitor('preferSingleLineFor'),
      WhileStatement: loopVisitor('preferSingleLineWhile'),
      DoWhileStatement() { /* do-while 结构特殊，暂不处理 */ },
    }
  },
}

export default rule

import type {Rule} from 'eslint'

const MAX_LINE_LENGTH = 160

/**
 * ESLint rule: prefer-single-line-if
 *
 * Prefer single-line if statements when possible.
 * This rule detects if-else chains with simple statements and converts them to single-line format.
 *
 * @example
 * // Before
 * if (condition) {
 *   return value
 * }
 *
 * // After
 * if (condition) return value
 */
const rule: Rule.RuleModule = {meta: {
  type: 'layout',
  docs: {description: 'Prefer single-line if statements when possible', recommended: false},
  fixable: 'code',
  schema: [],
  messages: {preferSingleLine: 'If-else chain with simple statements should be single-line format', preferSingleLineBranch: 'Simple if/else branch should be single-line format'},
}, create(context) {
  const {sourceCode} = context

  /* eslint-disable ts/no-unsafe-assignment */
  function getSingleStatement(node: Rule.Node | null | undefined): Rule.Node | null {
    if (!node) return null
    if (node.type !== 'BlockStatement') return node

    const {body} = node as any
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

  function normalizeConditionText(text: string): string {
    // 将多行条件压缩成单行，处理 || 和 && 分隔的情况
    return text
      .split('\n')
      .map(line => line.trim())
      .join(' ')
      .replaceAll(/\s+/g, ' ')
      .trim()
  }

  function canConditionBeSingleLine(test: Rule.Node): boolean {
    const condText = normalizeConditionText(sourceCode.getText(test))
    // 条件本身不能太长
    return condText.length < MAX_LINE_LENGTH - 40
  }

  function collectIfChain(node: Rule.Node): {conditions: Rule.Node[], finalElse: Rule.Node | null} {
    const conditions: Rule.Node[] = []
    let current: Rule.Node | null = node

    while (current && current.type === 'IfStatement') {
      conditions.push(current)
      current = ('alternate' in current ? current.alternate : null) as Rule.Node | null
    }

    return {conditions, finalElse: current}
  }

  function canBranchBeSimplified(consequent: Rule.Node, test: Rule.Node): boolean {
    if (consequent.type !== 'BlockStatement') return false
    if (!canConditionBeSingleLine(test)) return false
    if (hasComments(consequent)) return false

    const stmt = getSingleStatement(consequent)
    if (!stmt || !isSimpleStatement(stmt)) return false
    if (!isNodeSingleLine(stmt)) return false

    const condText = normalizeConditionText(sourceCode.getText(test))
    const stmtText = sourceCode.getText(stmt)
    const lineLength = `if (${condText}) ${stmtText}`.length
    return lineLength < MAX_LINE_LENGTH
  }

  function canConvertToSingleLine(node: Rule.Node): boolean {
    const {conditions, finalElse} = collectIfChain(node)

    for (const cond of conditions) {
      if (!('consequent' in cond) || !('test' in cond)) return false

      const test = cond.test as Rule.Node
      if (!canConditionBeSingleLine(test)) return false

      const consequent = cond.consequent as Rule.Node
      if (hasComments(consequent)) return false

      const stmt = getSingleStatement(consequent)
      if (!stmt || !isSimpleStatement(stmt)) return false
      if (!isNodeSingleLine(stmt)) return false
    }

    if (finalElse) {
      if (hasComments(finalElse)) return false
      const stmt = getSingleStatement(finalElse)
      if (!stmt || !isSimpleStatement(stmt)) return false
      if (!isNodeSingleLine(stmt)) return false
    }

    const lines: string[] = []
    for (let i = 0; i < conditions.length; i++) {
      const cond = conditions[i]
      if (!('consequent' in cond) || !('test' in cond)) continue
      const stmt = getSingleStatement(cond.consequent as Rule.Node)!
      const condText = normalizeConditionText(sourceCode.getText(cond.test as Rule.Node))
      const stmtText = sourceCode.getText(stmt)
      const prefix = i === 0 ? 'if' : 'else if'
      lines.push(`${prefix} (${condText}) ${stmtText}`)
    }

    if (!finalElse) return lines.every(line => line.length < MAX_LINE_LENGTH)

    const stmt = getSingleStatement(finalElse)!
    lines.push(`else ${sourceCode.getText(stmt)}`)
    return lines.every(line => line.length < MAX_LINE_LENGTH)
  }

  function isAlreadySingleLine(node: Rule.Node): boolean {
    const {conditions, finalElse} = collectIfChain(node)

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

  function isBranchAlreadySingleLine(consequent: Rule.Node, ifNode: Rule.Node): boolean {
    if (consequent.type === 'BlockStatement') return false
    return ifNode.loc?.start.line === consequent.loc?.end.line
  }

  return {IfStatement(node) {
    const {parent} = node
    // Skip if this is part of an else-if chain (will be handled by the root if)
    if (parent?.type === 'IfStatement' && 'alternate' in parent && parent.alternate === node) return

    // First, try to convert the entire chain
    if (!isAlreadySingleLine(node) && canConvertToSingleLine(node)) {
      context.report({node, messageId: 'preferSingleLine', fix(fixer) {
        const {conditions, finalElse} = collectIfChain(node)
        const indent = ' '.repeat(node.loc?.start.column ?? 0)
        const lines: string[] = []

        for (let i = 0; i < conditions.length; i++) {
          const cond = conditions[i]
          if (!('consequent' in cond) || !('test' in cond)) continue
          const stmt = getSingleStatement(cond.consequent as Rule.Node)!
          const condText = normalizeConditionText(sourceCode.getText(cond.test as Rule.Node))
          let stmtText = sourceCode.getText(stmt)

          if (!stmtText.endsWith(';') && !stmtText.endsWith('}')) stmtText = stmtText.trimEnd()

          const prefix = i === 0 ? 'if' : `${indent}else if`
          lines.push(`${prefix} (${condText}) ${stmtText}`)
        }

        if (!finalElse) return fixer.replaceText(node, lines.join('\n'))

        const stmt = getSingleStatement(finalElse)!
        let stmtText = sourceCode.getText(stmt)
        if (!stmtText.endsWith(';') && !stmtText.endsWith('}')) stmtText = stmtText.trimEnd()
        lines.push(`${indent}else ${stmtText}`)
        return fixer.replaceText(node, lines.join('\n'))
      }})
      return
    }

    // If entire chain can't be converted, try to simplify individual branches
    // We need to rebuild the entire chain to avoid syntax errors
    const {conditions, finalElse} = collectIfChain(node)

    // Check which branches can be simplified
    const branchSimplifiable: boolean[] = []
    for (const cond of conditions) {
      if (!('consequent' in cond) || !('test' in cond)) {
        branchSimplifiable.push(false)
        continue
      }
      const consequent = cond.consequent as Rule.Node
      const test = cond.test as Rule.Node
      const canSimplify = !isBranchAlreadySingleLine(consequent, cond) && canBranchBeSimplified(consequent, test)
      branchSimplifiable.push(canSimplify)
    }

    let finalElseSimplifiable = false
    if (finalElse && finalElse.type === 'BlockStatement' && !hasComments(finalElse)) {
      const stmt = getSingleStatement(finalElse)
      if (stmt && isSimpleStatement(stmt) && isNodeSingleLine(stmt)) {
        const stmtText = sourceCode.getText(stmt)
        finalElseSimplifiable = stmtText.length < MAX_LINE_LENGTH - 20
      }
    }

    // Due to `curly: ['error', 'multi-line']` rule (without 'consistent'),
    // we can simplify individual branches independently

    // Check if there's anything to simplify
    const hasSimplifiableBranch = branchSimplifiable.some(Boolean) || finalElseSimplifiable
    if (!hasSimplifiableBranch) return

    // Report on the root node and rebuild the entire chain
    context.report({node, messageId: 'preferSingleLineBranch', fix(fixer) {
      const indent = ' '.repeat(node.loc?.start.column ?? 0)
      const lines: string[] = []

      for (let i = 0; i < conditions.length; i++) {
        const cond = conditions[i]
        if (!('consequent' in cond) || !('test' in cond)) continue

        const consequent = cond.consequent as Rule.Node
        const test = cond.test as Rule.Node
        const condText = sourceCode.getText(test)
        const prefix = i === 0 ? 'if' : `${indent}else if`

        if (branchSimplifiable[i]) {
          // Simplify this branch
          const stmt = getSingleStatement(consequent)!
          let stmtText = sourceCode.getText(stmt)
          if (!stmtText.endsWith(';') && !stmtText.endsWith('}')) stmtText = stmtText.trimEnd()
          lines.push(`${prefix} (${condText}) ${stmtText}`)
        } else {
          // Keep original format (already single-line without braces)
          const consequentText = sourceCode.getText(consequent)
          lines.push(`${prefix} (${condText}) ${consequentText}`)
        }
      }

      if (finalElse) {
        if (finalElseSimplifiable) {
          const stmt = getSingleStatement(finalElse)!
          let stmtText = sourceCode.getText(stmt)
          if (!stmtText.endsWith(';') && !stmtText.endsWith('}')) stmtText = stmtText.trimEnd()
          lines.push(`${indent}else ${stmtText}`)
        } else {
          const elseText = sourceCode.getText(finalElse)
          lines.push(`${indent}else ${elseText}`)
        }
      }

      return fixer.replaceText(node, lines.join('\n'))
    }})
  }}
}}

export default rule

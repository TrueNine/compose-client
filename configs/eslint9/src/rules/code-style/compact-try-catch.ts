import type {Rule} from 'eslint'

type BlockNode = Rule.Node & {
  body: Rule.Node[]
}

type CatchClause = Rule.Node & {
  param: Rule.Node | null
  body: BlockNode
}

type TryStatement = Rule.Node & {
  block: BlockNode
  handler: CatchClause | null
  finalizer: BlockNode | null
}

const rule: Rule.RuleModule = {
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforce tiered compact try-catch-finally layout',
      recommended: false,
    },
    fixable: 'whitespace',
    messages: {
      compactCatch: 'Catch clause should be on the same line as the try block\'s closing brace',
      compactFinally: 'Finally clause should be on the same line as the previous block\'s closing brace',
      separateCatch: 'Catch clause should be on a new line when the try block is single-line',
      separateFinally: 'Finally clause should be on a new line when the previous block is single-line',
      compactBrace: 'Opening brace should be on the same line as the keyword',
      preferSingleLine: 'Block should be compressed to a single line',
    },
    schema: [],
  },
  create(context) {
    const {sourceCode} = context

    function getIndentation(node: Rule.Node): string {
      const startLoc = node.loc
      if (!startLoc) return ''
      const line = sourceCode.lines[startLoc.start.line - 1]
      const match = /^\s*/.exec(line)
      return match?.[0] ?? ''
    }

    function isSingleLine(node: Rule.Node): boolean {
      const {loc} = node
      if (!loc) return false
      return loc.start.line === loc.end.line
    }

    function canBeSingleLine(block: Rule.Node | null): boolean {
      if (block?.type !== 'BlockStatement') return false
      const bNode = block as BlockNode
      const {body} = bNode
      const comments = sourceCode.getCommentsInside(block)

      if (body.length > 1) return false
      if (body.length === 1) {
        const stmt = body[0]
        const allowed = ['ExpressionStatement', 'ReturnStatement', 'ThrowStatement', 'BreakStatement', 'ContinueStatement']
        if (!allowed.includes(stmt.type)) return false
        const stmtLoc = stmt.loc
        if (!stmtLoc || stmtLoc.start.line !== stmtLoc.end.line) return false
        if (sourceCode.getText(stmt).length > 60) return false
      }

      // If only comments, or 1 statement + some comments, check total length
      if (comments.length <= 0) return true

      const totalCommentLength = comments.reduce((acc, c) => acc + c.value.length + 6, 0)
      if (totalCommentLength > 80) return false
      return true
    }

    function getCompactBlockText(block: BlockNode): string {
      const {body} = block
      const comments = sourceCode.getCommentsInside(block)
      const parts: string[] = []

      if (comments.length > 0) {
        for (const comment of comments) {
          if (comment.type === 'Line') parts.push(`/* ${comment.value.trim()} */`)
          else parts.push(`/*${comment.value}*/`)
        }
      }

      if (body.length > 0) {
        const stmtText = sourceCode.getText(body[0]).trim().replace(/;$/, '')
        parts.push(`${stmtText};`)
      }

      if (parts.length === 0) return '{}'
      return `{ ${parts.join(' ')} }`
    }

    return {
      TryStatement(node: Rule.Node): void {
        const tryNode = node as unknown as TryStatement
        const indentation = getIndentation(node)
        const tryBlock = tryNode.block
        const tryCanBeSingle = canBeSingleLine(tryBlock)

        // Try compression
        if (tryCanBeSingle && !isSingleLine(tryBlock)) {
          context.report({
            node: tryBlock,
            messageId: 'preferSingleLine',
            fix: fixer => fixer.replaceTextRange(tryBlock.range as [number, number], getCompactBlockText(tryBlock)),
          })
        }

        // Catch Handling
        const {handler} = tryNode
        if (handler !== null) {
          const catchToken = sourceCode.getFirstToken(handler)
          const tryCloseBrace = sourceCode.getLastToken(tryBlock)
          const catchBlock = handler.body
          const catchCanBeSingle = canBeSingleLine(catchBlock)

          if (catchToken !== null && tryCloseBrace !== null) {
            // Compression
            if (catchCanBeSingle && !isSingleLine(catchBlock)) {
              context.report({
                node: catchBlock,
                messageId: 'preferSingleLine',
                fix: fixer => fixer.replaceTextRange(catchBlock.range as [number, number], getCompactBlockText(catchBlock)),
              })
            }

            // Separation logic (Potential based to report in pass 1)
            const finalTryIsSingle = isSingleLine(tryBlock) || tryCanBeSingle
            const spaceBefore = sourceCode.getTokenBefore(catchToken)
            if (spaceBefore !== null) {
              if (finalTryIsSingle) {
                if (tryCloseBrace.loc.end.line === catchToken.loc.start.line) {
                  context.report({
                    node: catchToken,
                    messageId: 'separateCatch',
                    fix: fixer => fixer.replaceTextRange([spaceBefore.range[1], catchToken.range[0]], `\n${indentation}`),
                  })
                }
              } else {
                if (tryCloseBrace.loc.end.line !== catchToken.loc.start.line) {
                  context.report({
                    node: catchToken,
                    messageId: 'compactCatch',
                    fix: fixer => fixer.replaceTextRange([spaceBefore.range[1], catchToken.range[0]], ' '),
                  })
                }
              }
            }
          }
        }

        // Finally Handling
        const {finalizer} = tryNode
        if (finalizer === null) return

        const finallyBlock = finalizer
        const finallyToken = sourceCode.getFirstTokenBetween(tryNode.handler ?? tryNode.block, finallyBlock, t => t.value === 'finally')
        const previousBlock = tryNode.handler !== null ? tryNode.handler.body : tryNode.block
        const prevCloseBrace = sourceCode.getLastToken(previousBlock)
        const finallyCanBeSingle = canBeSingleLine(finallyBlock)
        const prevCanBeSingle = canBeSingleLine(previousBlock)
        if (finallyToken === null && prevCloseBrace !== null) return

        if (finallyCanBeSingle && !isSingleLine(finallyBlock)) {
          context.report({
            node: finallyBlock,
            messageId: 'preferSingleLine',
            fix: fixer => fixer.replaceTextRange(finallyBlock.range as [number, number], getCompactBlockText(finallyBlock)),
          })
        }
        const finalPrevIsSingle = isSingleLine(previousBlock) || prevCanBeSingle
        const spaceBefore = sourceCode.getTokenBefore(finallyToken)
        if (spaceBefore !== null) {
          if (finalPrevIsSingle) {
            if (prevCloseBrace.loc.end.line === finallyToken.loc.start.line) {
              context.report({
                node: finallyToken,
                messageId: 'separateFinally',
                fix: fixer => fixer.replaceTextRange([spaceBefore.range[1], finallyToken.range[0]], `\n${indentation}`),
              })
            }
          } else {
            if (prevCloseBrace.loc.end.line !== finallyToken.loc.start.line) {
              context.report({
                node: finallyToken,
                messageId: 'compactFinally',
                fix: fixer => fixer.replaceTextRange([spaceBefore.range[1], finallyToken.range[0]], ' '),
              })
            }
          }
        }
      },
    }
  },
}

export default rule

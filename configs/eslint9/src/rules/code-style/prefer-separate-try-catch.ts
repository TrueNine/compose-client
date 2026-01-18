import type { Rule } from 'eslint'

const rule: Rule.RuleModule = {
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforce try, catch, and finally blocks to be on separate lines',
      recommended: false,
    },
    fixable: 'whitespace',
    messages: {
      separateCatch: 'Catch clause should be on a new line after the try block',
      separateFinally: 'Finally clause should be on a new line after the previous block',
    },
    schema: [],
  },
  create(context) {
    const { sourceCode } = context

    return {
      TryStatement(node) {
        const tryBlock = node.block
        const { handler } = node
        const { finalizer } = node

        if (handler) {
          const tryCloseBrace = sourceCode.getLastToken(tryBlock)
          const catchToken = sourceCode.getFirstToken(handler)

          if (tryCloseBrace && catchToken && tryBlock.loc && handler.body.loc) {
            const isTryMultiLine = tryBlock.loc.start.line !== tryBlock.loc.end.line
            const isCatchMultiLine = handler.body.loc.start.line !== handler.body.loc.end.line

            if (!isTryMultiLine || !isCatchMultiLine) {
              if (tryCloseBrace.loc.end.line === catchToken.loc.start.line) { // Handled by compact-try-catch
                context.report({ node: handler, messageId: 'separateCatch', fix(fixer) { return fixer.replaceTextRange([tryCloseBrace.range[1], catchToken.range[0]], '\n') } })
              }
            }
          }
        }

        if (!finalizer) return

        const previousBlock = handler ? handler.body : tryBlock
        const prevCloseBrace = sourceCode.getLastToken(previousBlock)
        const finallyToken = sourceCode.getFirstTokenBetween(
          handler ?? tryBlock,
          finalizer,
          token => token.value === 'finally',
        )
        if (prevCloseBrace && finallyToken && previousBlock.loc && finalizer.loc) {
          if (prevCloseBrace.loc.end.line === finallyToken.loc.start.line) {
            const isPrevMultiLine = previousBlock.loc.start.line !== previousBlock.loc.end.line
            const isFinallyMultiLine = finalizer.loc.start.line !== finalizer.loc.end.line

            if (!isPrevMultiLine || !isFinallyMultiLine) {
              context.report({ // Handled by compact-try-catch
                node: finalizer,
                loc: finallyToken.loc,
                messageId: 'separateFinally',
                fix(fixer) {
                  return fixer.replaceTextRange([prevCloseBrace.range[1], finallyToken.range[0]], '\n')
                },
              })
            }
          }
        }
      },
    }
  },
}

export default rule

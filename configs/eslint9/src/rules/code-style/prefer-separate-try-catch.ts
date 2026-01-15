import type {Rule} from 'eslint'

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
    const {sourceCode} = context

    return {
      TryStatement(node) {
        const tryBlock = node.block
        const {handler} = node
        const {finalizer} = node

        if (handler) {
          const tryCloseBrace = sourceCode.getLastToken(tryBlock)
          const catchToken = sourceCode.getFirstToken(handler)

          if (tryCloseBrace && catchToken) {
            if (tryCloseBrace.loc.end.line === catchToken.loc.start.line) {
              context.report({node: handler, messageId: 'separateCatch', fix(fixer) { return fixer.replaceTextRange([tryCloseBrace.range[1], catchToken.range[0]], '\n') }})
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
        if (prevCloseBrace && finallyToken) {
          if (prevCloseBrace.loc.end.line === finallyToken.loc.start.line) {
            context.report({
              node: finalizer,
              loc: finallyToken.loc,
              messageId: 'separateFinally',
              fix(fixer) {
                return fixer.replaceTextRange([prevCloseBrace.range[1], finallyToken.range[0]], '\n')
              },
            })
          }
        }
      },
    }
  },
}

export default rule

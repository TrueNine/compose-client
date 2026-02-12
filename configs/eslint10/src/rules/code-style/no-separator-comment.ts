import type {Rule} from 'eslint'

const rule: Rule.RuleModule = {
  meta: {
    type: 'layout',
    docs: {
      description: 'Remove comments containing repeated characters (===, ---, +++, ###, etc.) used as separators',
      recommended: false
    },
    fixable: 'code',
    messages: {
      noSeparatorComment: 'Separator comments with repeated characters are not allowed and will be removed.'
    },
    schema: []
  },
  create(context) {
    const {sourceCode} = context
    const separatorPattern = /(.)\1{2,}/ // Match 3+ consecutive identical characters (common separator patterns)

    return {
      Program() {
        const comments = sourceCode.getAllComments()

        for (const comment of comments) {
          if (separatorPattern.test(comment.value)) {
            context.report({
              loc: comment.loc!,
              messageId: 'noSeparatorComment',
              fix(fixer) {
                if (!comment.range || !comment.loc) return null

                const startLine = comment.loc.start.line
                const endLine = comment.loc.end.line
                const lineStart = sourceCode.getIndexFromLoc({line: startLine, column: 0})
                const lineEnd = sourceCode.lines[endLine - 1].length + sourceCode.getIndexFromLoc({line: endLine, column: 0})

                const contentBefore = sourceCode.text.slice(lineStart, comment.range[0])
                const contentAfter = sourceCode.text.slice(comment.range[1], lineEnd)

                if (contentBefore.trim() !== '' && contentAfter.trim() === '') return fixer.remove(comment as any)

                const isLastLine = endLine === sourceCode.lines.length
                if (isLastLine) return fixer.removeRange([lineStart, lineEnd])

                const nextLineStart = sourceCode.getIndexFromLoc({line: endLine + 1, column: 0})
                return fixer.removeRange([lineStart, nextLineStart])
              }
            })
          }
        }
      }
    }
  }
}

export default rule

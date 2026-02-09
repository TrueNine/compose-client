import type {Rule} from 'eslint' /* eslint-disable ts/no-unsafe-argument */

const rule: Rule.RuleModule = {
  meta: {
    type: 'layout',
    docs: {
      description: 'Remove redundant "Requirements" lines from document comments',
      recommended: false
    },
    fixable: 'code',
    messages: {
      noDocumentRequirements: 'Redundant "Requirements" lines in document comments are not allowed and will be removed.'
    },
    schema: []
  },
  create(context) {
    const {sourceCode} = context
    const requirementsPattern = /^\s*\* Requirements/m

    return {
      Program() {
        const comments = sourceCode.getAllComments()

        for (const comment of comments) {
          const content = comment.value
          if (comment.type === 'Block' && requirementsPattern.test(content)) {
            context.report({
              loc: comment.loc!,
              messageId: 'noDocumentRequirements',
              fix(fixer) {
                if (!comment.range) return null

                const commentText = sourceCode.getText(comment as any)
                const lines = commentText.split('\n')
                const filteredLines = lines.filter(line => !/^\s*\* Requirements/.test(line))

                const hasContent = filteredLines.some(line => { // Check if the comment still has meaningful content
                  const l = line.trim()
                  return l !== '' && l !== '/*' && l !== '/**' && l !== '*/' && l !== '*'
                })

                if (hasContent) return fixer.replaceText(comment as any, filteredLines.join('\n'))

                const startLine = comment.loc!.start.line // If no content remains, remove the entire comment block
                const endLine = comment.loc!.end.line
                const lineStart = sourceCode.getIndexFromLoc({line: startLine, column: 0})
                const lineEnd = sourceCode.lines[endLine - 1].length + sourceCode.getIndexFromLoc({line: endLine, column: 0})

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

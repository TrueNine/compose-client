/* eslint-disable ts/no-unsafe-argument */
import type {Rule} from 'eslint'

const rule: Rule.RuleModule = {
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforce all comments (except JSDoc and tooling) to be beside code to save lines',
      recommended: false,
    },
    fixable: 'whitespace',
    messages: {
      besideComment: 'Comment must be on the same line as code (inline/beside) to save vertical space',
    },
    schema: [],
  },
  create(context) {
    const {sourceCode} = context

    return {
      Program() {
        const comments = sourceCode.getAllComments()
        const {lines} = sourceCode

        for (const comment of comments) {
          // eslint-disable-next-line ts/no-unsafe-member-access
          if ((comment as any).type === 'Shebang') continue
          if (comment.type === 'Block' && comment.value.startsWith('*')) continue /* Ignore JSDoc comments (Block comments starting with *) */

          const trimmedValue = comment.value.trim()
          if (comment.type === 'Line' && (trimmedValue.startsWith('/') || trimmedValue.startsWith('!'))) continue /* Ignore /// <reference ... /> tags, shebangs */
          if (trimmedValue.startsWith('ts-') || trimmedValue.startsWith('eslint-') || trimmedValue.startsWith('#')) continue

          const {loc, range} = comment
          if (!loc || !range) continue

          const startLine = loc.start.line
          const endLine = loc.end.line

          for (let i = startLine; i <= endLine; i++) {
            const lineText = lines[i - 1]
            let lineWithCode = lineText
            if (i === startLine && i === endLine) lineWithCode = lineText.slice(0, loc.start.column) + lineText.slice(loc.end.column)
            else if (i === startLine) lineWithCode = lineText.slice(0, loc.start.column)
            else if (i === endLine) lineWithCode = lineText.slice(loc.end.column)
            else lineWithCode = ''

            if (lineWithCode.trim() === '') {
              context.report({
                loc: {
                  start: {line: i, column: 0},
                  end: {line: i, column: lineText.length},
                },
                messageId: 'besideComment',
                fix(fixer) {
                  if (i === endLine && lines[i] !== void 0 && lines[i].trim() !== '') { /* Attempt to move the comment to the end of the next line if it contains code */
                    const nextLineText = lines[i]
                    const commentText = sourceCode.getText(comment as any).trim()
                    /* Then append the comment to the end of the next line */ /* Replace the original comment and following newline with nothing */
                    /* For now, just a simple replacement of the comment with empty space */ /* This is a bit complex due to potential multiple standalone comments */
                    /* Better: replace [comment.range[0]...nextLineEnd] with [nextLineLines...comment] */ /* and appending it to the next line might cause issues with ranges */
                    const nextLineEnd = sourceCode.getIndexFromLoc({line: i + 1, column: nextLineText.length})
                    return fixer.replaceTextRange([range[0], nextLineEnd], `${nextLineText} ${commentText}`)
                  }

                  if (i <= 1 || (i !== startLine && lines[i - 2].trim() !== '')) return null

                  const prevLineText = lines[i - 2]
                  const commentText = sourceCode.getText(comment as any).trim()
                  const prevLineStart = sourceCode.getIndexFromLoc({line: i - 1, column: 0})
                  return fixer.replaceTextRange([prevLineStart, range[1]], `${prevLineText} ${commentText}`)
                },
              })
              break
            }
          }
        }
      },
    }
  },
}

export default rule

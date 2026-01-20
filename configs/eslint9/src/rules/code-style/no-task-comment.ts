import type {Rule} from 'eslint'

const rule: Rule.RuleModule = {
  meta: {
    type: 'layout',
    docs: {
      description: 'Remove comments containing task markers (TODO, FIXME, etc.)',
      recommended: false
    },
    messages: {
      noTaskComment: 'Task comments (TODO, FIXME) should be addressed and removed.'
    },
    schema: []
  },
  create(context) {
    const {sourceCode} = context
    const taskKeywords = ['TODO', 'FIXME', 'todo', 'fixme']
    const taskPattern = new RegExp(`^\\s*(?:\\*\\s*)?(?:${taskKeywords.join('|')})`, 'm') // Match line start, optional star (for block comments), optional space, then keyword

    return {
      Program() {
        const comments = sourceCode.getAllComments()

        for (const comment of comments) {
          const content = comment.value
          if (taskPattern.test(content)) context.report({loc: comment.loc!, messageId: 'noTaskComment'})
        }
      }
    }
  }
}

export default rule

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

const MAX_SINGLE_LINE_LENGTH = 120

const rule: Rule.RuleModule = {
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforce compact try-catch-finally layout with independent block optimization',
      recommended: false,
    },
    fixable: 'whitespace',
    messages: {
      compactCatch: 'Catch clause should be on the same line as the try block\'s closing brace',
      compactFinally: 'Finally clause should be on the same line as the previous block\'s closing brace',
      preferSingleLineTry: 'Try block should be compressed to a single line',
      preferSingleLineCatch: 'Catch block should be compressed to a single line',
      preferSingleLineFinally: 'Finally block should be compressed to a single line',
    },
    schema: [],
  },
  create(context) {
    const {sourceCode} = context

    function isSingleLine(node: Rule.Node): boolean {
      const {loc} = node
      if (!loc) return false
      return loc.start.line === loc.end.line
    }

    function canBeSingleLine(block: Rule.Node | null): boolean {
      if (block?.type !== 'BlockStatement') return false
      const bNode = block as BlockNode
      const {body} = bNode

      if (body.length === 0) return true // 空块总是可以单行

      if (body.length > 1) return false // 多于一条语句不能单行

      const stmt = body[0] // 检查单条语句
      const allowedTypes = ['ExpressionStatement', 'ReturnStatement', 'ThrowStatement', 'BreakStatement', 'ContinueStatement']
      if (!allowedTypes.includes(stmt.type)) return false

      const stmtLoc = stmt.loc // 语句本身必须是单行
      if (!stmtLoc || stmtLoc.start.line !== stmtLoc.end.line) return false

      const stmtText = sourceCode.getText(stmt).trim() // 检查语句文本长度（不包括块的花括号）
      if (stmtText.length > 100) return false

      const compactText = getCompactBlockText(bNode) // 检查压缩后的总长度
      if (compactText.length > MAX_SINGLE_LINE_LENGTH) return false

      return true
    }

    function getCompactBlockText(block: BlockNode): string {
      const {body} = block

      if (body.length === 0) return '{}' // 空块

      const stmtText = sourceCode.getText(body[0]).trim().replace(/;$/, '') // 获取语句文本，移除尾部分号后重新添加
      return `{ ${stmtText}; }`
    }

    return {
      TryStatement(node: Rule.Node): void {
        const tryNode = node as unknown as TryStatement
        const tryBlock = tryNode.block
        const {handler, finalizer} = tryNode

        const tryCanBeSingle = canBeSingleLine(tryBlock) // 检查 try 块是否可以单行化
        const tryIsSingle = isSingleLine(tryBlock)

        if (tryCanBeSingle && !tryIsSingle) {
          context.report({
            node: tryBlock,
            messageId: 'preferSingleLineTry',
            fix: fixer => fixer.replaceTextRange(tryBlock.range as [number, number], getCompactBlockText(tryBlock)),
          })
        }

        if (handler !== null) { // 检查 catch 块
          const catchBlock = handler.body
          const catchCanBeSingle = canBeSingleLine(catchBlock)
          const catchIsSingle = isSingleLine(catchBlock)

          if (catchCanBeSingle && !catchIsSingle) { // 独立检查 catch 块是否可以单行化
            context.report({
              node: catchBlock,
              messageId: 'preferSingleLineCatch',
              fix: fixer => fixer.replaceTextRange(catchBlock.range as [number, number], getCompactBlockText(catchBlock)),
            })
          }

          const tryIsMultiLine = !tryIsSingle && !tryCanBeSingle // 检查 } catch 是否在同一行（仅当 try 是多行且不能单行化时）
          if (tryIsMultiLine) {
            const tryCloseBrace = sourceCode.getLastToken(tryBlock)
            const catchToken = sourceCode.getFirstToken(handler)

            if (tryCloseBrace !== null && catchToken !== null && tryCloseBrace.loc !== null && catchToken.loc !== null) {
              if (tryCloseBrace.loc.end.line !== catchToken.loc.start.line) {
                const spaceBefore = sourceCode.getTokenBefore(catchToken)
                if (spaceBefore !== null) {
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

        if (finalizer === null) return

        const finallyBlock = finalizer
        const finallyCanBeSingle = canBeSingleLine(finallyBlock)
        const finallyIsSingle = isSingleLine(finallyBlock)
        if (finallyCanBeSingle && !finallyIsSingle) { // 独立检查 finally 块是否可以单行化
          context.report({
            node: finallyBlock,
            messageId: 'preferSingleLineFinally',
            fix: fixer => fixer.replaceTextRange(finallyBlock.range as [number, number], getCompactBlockText(finallyBlock)),
          })
        }
        const previousBlock = handler !== null ? handler.body : tryBlock
        const prevCanBeSingle = canBeSingleLine(previousBlock)
        const prevIsSingle = isSingleLine(previousBlock)
        const prevIsMultiLine = !prevIsSingle && !prevCanBeSingle
        if (!prevIsMultiLine) return

        const prevCloseBrace = sourceCode.getLastToken(previousBlock)
        const finallyToken = sourceCode.getFirstTokenBetween(
          handler ?? tryBlock,
          finallyBlock,
          t => t.value === 'finally',
        )
        if (prevCloseBrace !== null && finallyToken !== null && prevCloseBrace.loc !== null && finallyToken.loc !== null) {
          if (prevCloseBrace.loc.end.line !== finallyToken.loc.start.line) {
            const spaceBefore = sourceCode.getTokenBefore(finallyToken)
            if (spaceBefore !== null) {
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

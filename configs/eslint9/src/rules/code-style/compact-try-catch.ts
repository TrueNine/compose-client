import type { Rule } from 'eslint'

/**
 * ESLint rule: compact-try-catch
 *
 * Enforce tiered layout for try-catch-finally:
 * 1. Blocks with 1 simple statement are compressed to single line.
 * 2. If the block is (or will be) single-line, the next keyword starts on a new line.
 * 3. If the block is multi-line, the next keyword joins the brace '}'.
 */
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
        const { sourceCode } = context

        function getIndentation(node: any) {
            return sourceCode.lines[node.loc!.start.line - 1].match(/^\s*/)?.[0] || ''
        }

        function isSingleLine(node: any) {
            return node.loc!.start.line === node.loc!.end.line
        }

        function canBeSingleLine(block: any) {
            if (!block || block.type !== 'BlockStatement') return false
            const body = block.body
            if (body.length > 1) return false
            if (body.length === 1) {
                const stmt = body[0]
                const allowed = ['ExpressionStatement', 'ReturnStatement', 'ThrowStatement', 'BreakStatement', 'ContinueStatement']
                if (!allowed.includes(stmt.type)) return false
                if (stmt.loc!.start.line !== stmt.loc!.end.line) return false
                if (sourceCode.getText(stmt).length > 60) return false
            }
            if (sourceCode.getCommentsInside(block).length > 0) return false
            return true
        }

        function getCompactBlockText(block: any) {
            const body = block.body
            if (body.length === 0) return '{}'
            const stmtText = sourceCode.getText(body[0]).trim().replace(/;$/, '')
            return `{ ${stmtText}; }`
        }

        return {
            TryStatement(node: any) {
                const indentation = getIndentation(node)
                const tryBlock = node.block
                const tryCanBeSingle = canBeSingleLine(tryBlock)

                // Try compression
                if (tryCanBeSingle && !isSingleLine(tryBlock)) {
                    context.report({
                        node: tryBlock,
                        messageId: 'preferSingleLine',
                        fix: fixer => fixer.replaceTextRange(tryBlock.range, getCompactBlockText(tryBlock)),
                    })
                }

                // Catch Handling
                if (node.handler) {
                    const catchToken = sourceCode.getFirstToken(node.handler)!
                    const tryCloseBrace = sourceCode.getLastToken(tryBlock)!
                    const catchBlock = node.handler.body
                    const catchCanBeSingle = canBeSingleLine(catchBlock)

                    // Compression
                    if (catchCanBeSingle && !isSingleLine(catchBlock)) {
                        context.report({
                            node: catchBlock,
                            messageId: 'preferSingleLine',
                            fix: fixer => fixer.replaceTextRange(catchBlock.range, getCompactBlockText(catchBlock)),
                        })
                    }

                    // Separation logic (Potential based to report in pass 1)
                    const finalTryIsSingle = isSingleLine(tryBlock) || tryCanBeSingle
                    if (finalTryIsSingle) {
                        if (tryCloseBrace.loc.end.line === catchToken.loc.start.line) {
                            // To avoid conflict with try compression, we use catch token as the node and insert BEFORE it
                            context.report({
                                node: catchToken,
                                messageId: 'separateCatch',
                                fix: fixer => fixer.insertTextBefore(catchToken, `\n${indentation}`),
                            })
                        }
                    } else {
                        if (tryCloseBrace.loc.end.line !== catchToken.loc.start.line) {
                            context.report({
                                node: catchToken,
                                messageId: 'compactCatch',
                                fix: fixer => fixer.replaceTextRange([tryCloseBrace.range[1], catchToken.range[0]], ' '),
                            })
                        }
                    }
                }

                // Finally Handling
                if (node.finalizer) {
                    const finallyBlock = node.finalizer
                    const finallyToken = sourceCode.getFirstTokenBetween(node.handler ?? node.block, finallyBlock, t => t.value === 'finally')!
                    const previousBlock = node.handler ? node.handler.body : node.block
                    const prevCloseBrace = sourceCode.getLastToken(previousBlock)!
                    const finallyCanBeSingle = canBeSingleLine(finallyBlock)
                    const prevCanBeSingle = canBeSingleLine(previousBlock)

                    if (finallyCanBeSingle && !isSingleLine(finallyBlock)) {
                        context.report({
                            node: finallyBlock,
                            messageId: 'preferSingleLine',
                            fix: fixer => fixer.replaceTextRange(finallyBlock.range, getCompactBlockText(finallyBlock)),
                        })
                    }

                    const finalPrevIsSingle = isSingleLine(previousBlock) || prevCanBeSingle
                    if (finalPrevIsSingle) {
                        if (prevCloseBrace.loc.end.line === finallyToken.loc.start.line) {
                            context.report({
                                node: finallyToken,
                                messageId: 'separateFinally',
                                fix: fixer => fixer.insertTextBefore(finallyToken, `\n${indentation}`),
                            })
                        }
                    } else {
                        if (prevCloseBrace.loc.end.line !== finallyToken.loc.start.line) {
                            context.report({
                                node: finallyToken,
                                messageId: 'compactFinally',
                                fix: fixer => fixer.replaceTextRange([prevCloseBrace.range[1], finallyToken.range[0]], ' '),
                            })
                        }
                    }
                }
            },
        }
    },
}

export default rule

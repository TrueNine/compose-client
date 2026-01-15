import type { Rule } from 'eslint'

/**
 * ESLint rule: prefer-separate-try-catch
 *
 * Enforce try-catch-finally blocks to be on separate lines (braces)
 *
 * @example
 * // Before
 * try { ... } catch (e) { ... }
 *
 * // After
 * try { ... }
 * catch (e) { ... }
 */
const rule: Rule.RuleModule = {
    meta: {
        type: 'layout',
        docs: {
            description: 'Enforce try-catch-finally blocks to be on separate lines',
            recommended: false,
        },
        fixable: 'whitespace',
        messages: {
            separateTry: 'Try statement should be on a new line',
            separateCatch: 'Catch clause should be on a new line',
            separateFinally: 'Finally clause should be on a new line',
        },
        schema: [],
    },
    create(context) {
        const { sourceCode } = context

        return {
            TryStatement(node) {
                // 1. Check 'try' keyword
                const tryToken = sourceCode.getFirstToken(node)!
                const tokenBefore = sourceCode.getTokenBefore(node)

                // Only separate if tokenBefore is NOT on a different line
                if (tokenBefore && tokenBefore.loc!.end.line === tryToken.loc!.start.line) {
                    context.report({
                        node: tryToken,
                        messageId: 'separateTry',
                        fix: fixer => fixer.insertTextBefore(tryToken, '\n'),
                    })
                }

                // 2. Check 'catch'
                if (node.handler) {
                    const catchToken = sourceCode.getFirstToken(node.handler) // 'catch'
                    const tryBlock = node.block
                    const tryCloseBrace = sourceCode.getLastToken(tryBlock)!

                    if (tryCloseBrace.loc!.end.line === catchToken!.loc!.start.line) {
                        context.report({
                            node: catchToken!,
                            messageId: 'separateCatch',
                            fix: fixer => fixer.insertTextBefore(catchToken!, '\n'),
                        })
                    }
                }

                // 3. Check 'finally'
                if (node.finalizer) {
                    const finallyToken = sourceCode.getFirstTokenBetween(
                        node.handler || node.block,
                        node.finalizer,
                        token => token.value === 'finally'
                    )!
                    const previousBlock = node.handler ? node.handler.body : node.block
                    const prevCloseBrace = sourceCode.getLastToken(previousBlock)!

                    if (prevCloseBrace.loc!.end.line === finallyToken.loc!.start.line) {
                        context.report({
                            node: finallyToken,
                            messageId: 'separateFinally',
                            fix: fixer => fixer.insertTextBefore(finallyToken, '\n'),
                        })
                    }
                }
            }
        }
    }
}

export default rule

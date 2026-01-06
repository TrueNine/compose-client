import type { Rule } from 'eslint'

interface IfStatementNode extends Rule.Node {
    test: Rule.Node
    consequent: Rule.Node
    alternate: Rule.Node | null
}

interface BlockStatementNode extends Rule.Node {
    body: Rule.Node[]
}

interface ReturnStatementNode extends Rule.Node {
    argument: Rule.Node | null
}

const rule: Rule.RuleModule = {
    meta: {
        type: 'suggestion',
        docs: {
            description: 'Prefer guard clauses (early returns) to reduce nesting',
            recommended: false,
        },
        fixable: 'code',
        schema: [
            {
                type: 'object',
                properties: {
                    minStatements: {
                        type: 'number',
                        default: 2,
                    },
                },
                additionalProperties: false,
            },
        ],
        messages: {
            preferGuardClause: 'Prefer guard clause with early return to reduce nesting',
        },
    },
    create(context) {
        const sourceCode = context.sourceCode
        const options = context.options[0] || {}
        const minStatements = options.minStatements ?? 2

        function isBlockStatement(node: Rule.Node): node is BlockStatementNode {
            return node.type === 'BlockStatement'
        }

        function isIfStatement(node: Rule.Node): node is IfStatementNode {
            return node.type === 'IfStatement'
        }

        function isReturnStatement(node: Rule.Node): node is ReturnStatementNode {
            return node.type === 'ReturnStatement'
        }

        function isFunctionBody(node: Rule.Node): boolean {
            const parent = node.parent
            return parent?.type === 'FunctionDeclaration'
                || parent?.type === 'FunctionExpression'
                || parent?.type === 'ArrowFunctionExpression'
        }

        function getStatementsAfterIf(ifNode: IfStatementNode): Rule.Node[] {
            const parent = ifNode.parent
            if (!parent || !isBlockStatement(parent)) return []

            const body = parent.body
            const ifIndex = body.indexOf(ifNode)
            return body.slice(ifIndex + 1).filter(stmt => stmt.type !== 'EmptyStatement')
        }

        function isOnlyReturnAfterIf(ifNode: IfStatementNode): { isOnly: boolean, returnNode: ReturnStatementNode | null } {
            const statementsAfter = getStatementsAfterIf(ifNode)
            if (statementsAfter.length === 1 && isReturnStatement(statementsAfter[0])) {
                return { isOnly: true, returnNode: statementsAfter[0] }
            }
            return { isOnly: false, returnNode: null }
        }

        function canInvertWithGuard(node: IfStatementNode): boolean {
            // Must have no else branch
            if (node.alternate) return false

            // Must be in a block
            const parent = node.parent
            if (!parent || !isBlockStatement(parent)) return false

            // Must be in function body
            if (!isFunctionBody(parent)) return false

            // Consequent must be a block with statements
            if (!isBlockStatement(node.consequent)) return false

            const block = node.consequent as BlockStatementNode
            if (block.body.length < minStatements) return false

            return true
        }

        function invertCondition(conditionText: string): string {
            const trimmed = conditionText.trim()

            // Handle negation: !x -> x
            if (trimmed.startsWith('!') && !trimmed.startsWith('!=')) {
                const inner = trimmed.slice(1).trim()
                if (inner.startsWith('(') && inner.endsWith(')')) {
                    return inner.slice(1, -1)
                }
                return inner
            }

            // Handle comparison operators
            if (trimmed.includes('===')) return trimmed.replace('===', '!==')
            if (trimmed.includes('!==')) return trimmed.replace('!==', '===')
            if (trimmed.includes('==') && !trimmed.includes('===')) return trimmed.replace('==', '!=')
            if (trimmed.includes('!=') && !trimmed.includes('!==')) return trimmed.replace('!=', '==')
            if (trimmed.includes('>=')) return trimmed.replace('>=', '<')
            if (trimmed.includes('<=')) return trimmed.replace('<=', '>')
            if (trimmed.includes('>') && !trimmed.includes('>=')) return trimmed.replace('>', '<=')
            if (trimmed.includes('<') && !trimmed.includes('<=')) return trimmed.replace('<', '>=')

            // Handle .length > 0 pattern
            if (/\.length\s*>\s*0/.test(trimmed)) {
                return trimmed.replace(/\.length\s*>\s*0/, '.length === 0')
            }
            if (/\.length\s*===\s*0/.test(trimmed)) {
                return trimmed.replace(/\.length\s*===\s*0/, '.length > 0')
            }

            // Default: wrap with negation
            if (trimmed.includes('&&') || trimmed.includes('||')) {
                return `!(${trimmed})`
            }

            return `!${trimmed}`
        }

        function getIndent(node: Rule.Node): string {
            return ' '.repeat(node.loc?.start.column ?? 0)
        }

        function getReturnText(returnNode: ReturnStatementNode | null): string {
            if (!returnNode) return 'return'
            if (!returnNode.argument) return 'return'
            return sourceCode.getText(returnNode)
        }

        return {
            IfStatement(node) {
                const ifNode = node as IfStatementNode

                // Skip if already processed as part of if-else chain
                const parent = ifNode.parent
                if (parent?.type === 'IfStatement' && (parent as IfStatementNode).alternate === ifNode) {
                    return
                }

                if (!canInvertWithGuard(ifNode)) return

                const block = ifNode.consequent as BlockStatementNode
                const statementsAfter = getStatementsAfterIf(ifNode)

                // Case 1: if block followed by single return statement
                const { isOnly: hasOnlyReturn, returnNode } = isOnlyReturnAfterIf(ifNode)
                if (hasOnlyReturn && returnNode) {
                    context.report({
                        node: ifNode,
                        messageId: 'preferGuardClause',
                        fix(fixer) {
                            const conditionText = sourceCode.getText(ifNode.test)
                            const invertedCondition = invertCondition(conditionText)
                            const indent = getIndent(ifNode)
                            const returnText = getReturnText(returnNode)

                            const bodyText = block.body
                                .map(stmt => sourceCode.getText(stmt))
                                .join('\n' + indent)

                            const result = `if (${invertedCondition}) ${returnText}\n\n${indent}${bodyText}`

                            // Replace from if statement to return statement
                            const rangeStart = ifNode.range![0]
                            const rangeEnd = returnNode.range![1]

                            return fixer.replaceTextRange([rangeStart, rangeEnd], result)
                        },
                    })
                    return
                }

                // Case 2: if block is last statement in function (no statements after)
                if (statementsAfter.length === 0) {
                    const lastStmt = block.body[block.body.length - 1]
                    const endsWithReturn = isReturnStatement(lastStmt)

                    context.report({
                        node: ifNode,
                        messageId: 'preferGuardClause',
                        fix(fixer) {
                            const conditionText = sourceCode.getText(ifNode.test)
                            const invertedCondition = invertCondition(conditionText)
                            const indent = getIndent(ifNode)

                            if (endsWithReturn) {
                                const statementsWithoutReturn = block.body.slice(0, -1)
                                if (statementsWithoutReturn.length === 0) {
                                    return fixer.replaceText(ifNode, `if (${invertedCondition}) return`)
                                }
                                const bodyText = statementsWithoutReturn
                                    .map(stmt => sourceCode.getText(stmt))
                                    .join('\n' + indent)
                                return fixer.replaceText(ifNode, `if (${invertedCondition}) return\n\n${indent}${bodyText}`)
                            }

                            const bodyText = block.body
                                .map(stmt => sourceCode.getText(stmt))
                                .join('\n' + indent)
                            return fixer.replaceText(ifNode, `if (${invertedCondition}) return\n\n${indent}${bodyText}`)
                        },
                    })
                }
            },
        }
    },
}

export default rule

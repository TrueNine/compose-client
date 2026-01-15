import { RuleTester } from 'eslint'
import * as tseslint from 'typescript-eslint'
import { describe, it } from 'vitest'
import rule from './compact-try-catch'

const ruleTester = new RuleTester({
    languageOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        parser: tseslint.parser,
    },
})

describe('compact-try-catch', () => {
    describe('valid', () => {
        it('should allow tiered layout', () => {
            ruleTester.run('compact-try-catch', rule, {
                valid: [
                    'try {\n  a();\n  b();\n} catch (e) {\n  c();\n  d();\n}',
                    'try { a(); }\ncatch (e) { b(); }',
                ],
                invalid: [],
            })
        })
    })

    describe('invalid - compression', () => {
        it('should compress try', () => {
            ruleTester.run('compact-try-catch', rule, {
                valid: [],
                invalid: [
                    {
                        code: 'try {\n  a();\n} catch (e) {\n  b();\n  c();\n}',
                        output: 'try { a(); }\ncatch (e) {\n  b();\n  c();\n}',
                        errors: [
                            { messageId: 'preferSingleLine' }, // Pass 1: try is physically multi
                        ],
                    }
                ]
            })
        })
    })
})

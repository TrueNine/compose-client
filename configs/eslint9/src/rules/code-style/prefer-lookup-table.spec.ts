import {RuleTester} from 'eslint'
import * as tseslint from 'typescript-eslint'
import {describe, it} from 'vitest'
import rule from './prefer-lookup-table'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parser: tseslint.parser,
  },
})

describe('prefer-lookup-table', () => {
  describe('valid cases', () => {
    it('should allow fewer checks than threshold (default 4)', () => {
      ruleTester.run('prefer-lookup-table', rule, {
        valid: [
          'if (a === \'1\' || a === \'2\' || a === \'3\') {}',
          'const res = type === \'A\' || type === \'B\'',
        ],
        invalid: [],
      })
    })

    it('should allow checks against different variables', () => {
      ruleTester.run('prefer-lookup-table', rule, {
        valid: [
          'if (a === \'1\' || b === \'1\' || c === \'1\' || d === \'1\') {}',
          'if (a === \'1\' || a === \'2\' || b === \'3\' || b === \'4\') {}',
        ],
        invalid: [],
      })
    })

    it('should allow non-equality checks', () => {
      ruleTester.run('prefer-lookup-table', rule, {
        valid: [
          'if (a > 1 || a < 10 || a === 5 || a === 6) {}',
          'if (a !== \'1\' || a !== \'2\' || a !== \'3\' || a !== \'4\') {}', // Strict inequality not covered
        ],
        invalid: [],
      })
    })

    it('should allow non-literal comparisons', () => {
      ruleTester.run('prefer-lookup-table', rule, {
        valid: [
          'if (a === b || a === c || a === d || a === e) {}', // Assuming variable comparison is not flagged as we look for Literals
        ],
        invalid: [],
      })
    })
  })

  describe('invalid cases', () => {
    it('should report for >= 4 checks (default threshold)', () => {
      ruleTester.run('prefer-lookup-table', rule, {
        valid: [],
        invalid: [
          {
            code: 'if (a === \'1\' || a === \'2\' || a === \'3\' || a === \'4\') {}',
            errors: [{messageId: 'preferLookup', data: {count: '4'}}],
            output: 'if (new Set([\'1\', \'2\', \'3\', \'4\']).has(a)) {}',
          },
        ],
      })
    })

    it('should report for mixed left/right operand positions', () => {
      ruleTester.run('prefer-lookup-table', rule, {
        valid: [],
        invalid: [
          {
            code: 'if (\'1\' === a || a === \'2\' || \'3\' === a || a === \'4\') {}',
            errors: [{messageId: 'preferLookup', data: {count: '4'}}],
            output: 'if (new Set([\'1\', \'2\', \'3\', \'4\']).has(a)) {}',
          },
        ],
      })
    })

    it('should report for mixed equality operators (== and ===)', () => {
      ruleTester.run('prefer-lookup-table', rule, {
        valid: [],
        invalid: [
          {
            code: 'if (a == \'1\' || a === \'2\' || a == \'3\' || a === \'4\') {}',
            errors: [{messageId: 'preferLookup', data: {count: '4'}}],
            output: 'if (new Set([\'1\', \'2\', \'3\', \'4\']).has(a)) {}',
          },
        ],
      })
    })

    it('should support different literal types', () => {
      ruleTester.run('prefer-lookup-table', rule, {
        valid: [],
        invalid: [
          {
            code: 'if (a === 1 || a === 2 || a === 3 || a === 4) {}',
            errors: [{messageId: 'preferLookup', data: {count: '4'}}],
            output: 'if (new Set([1, 2, 3, 4]).has(a)) {}',
          },
        ],
      })
    })

    it('should work within larger expressions', () => {
      ruleTester.run('prefer-lookup-table', rule, {
        valid: [],
        invalid: [
          {
            code: 'if (isValid && (type === \'A\' || type === \'B\' || type === \'C\' || type === \'D\')) {}',
            errors: [{messageId: 'preferLookup', data: {count: '4'}}],
            output: 'if (isValid && (new Set([\'A\', \'B\', \'C\', \'D\']).has(type))) {}',
          },
        ],
      })
    })
  })

  describe('options', () => {
    it('should respect custom threshold', () => {
      ruleTester.run('prefer-lookup-table', rule, {
        valid: [
          { // 4 checks is valid if threshold is 5
            code: 'if (a === \'1\' || a === \'2\' || a === \'3\' || a === \'4\') {}',
            options: [{threshold: 5}],
          },
        ],
        invalid: [
          { // 3 checks is invalid if threshold is 3
            code: 'if (a === \'1\' || a === \'2\' || a === \'3\') {}',
            options: [{threshold: 3}],
            errors: [{messageId: 'preferLookup', data: {count: '3'}}],
            output: 'if (new Set([\'1\', \'2\', \'3\']).has(a)) {}',
          },
        ],
      })
    })
  })
})

import type {Rule} from 'eslint' // @ts-nocheck
import {createRequire} from 'node:module'

/* eslint-disable ts/no-unsafe-member-access, ts/no-unsafe-assignment, ts/no-unsafe-argument, ts/strict-boolean-expressions */

const require = createRequire(import.meta.url)

let originalRule: Rule.RuleModule = {} as Rule.RuleModule

try {
  const plugin = require('@stylistic/eslint-plugin')
  originalRule = plugin.rules['brace-style']
}
catch (e) {
  console.error('Failed to load @stylistic/eslint-plugin/brace-style', e)
}

const rule: Rule.RuleModule = {
  meta: {
    ...originalRule?.meta,
    docs: {
      ...originalRule?.meta?.docs,
      description: 'Custom brace style that enforces 1tbs but allows separate lines for try-catch-finally',
    },
  },
  create(context) {
    if (!originalRule?.create) return {}

    const {sourceCode} = context

    return originalRule.create(Object.create(context, {
      report: {
        value: (descriptor: any) => {
          const {node, loc} = descriptor
          const startLoc = loc ? loc.start : node ? node.loc.start : null

          if (startLoc) {
            const index = sourceCode.getIndexFromLoc(startLoc)
            const token = sourceCode.getTokenByRangeStart(index)

            if (token) {
              if (token.value === 'catch' || token.value === 'finally') return // If the token is 'catch' or 'finally', suppress

              if (token.value === '}') { // If the token is '}', check if the next token is 'catch' or 'finally'
                const nextToken = sourceCode.getTokenAfter(token)
                if (nextToken && (nextToken.value === 'catch' || nextToken.value === 'finally')) return
              }
            }
          }

          context.report(descriptor)
        },
        writable: false,
        configurable: false,
      },
    }))
  },
}

export default rule

import type {Rule} from 'eslint'

/**
 * ESLint rule: prefer-void-zero
 *
 * Detects and fixes `undefined` to `void 0` in value positions.
 * Only fixes value-level `undefined`, NOT type annotations.
 *
 * @example
 * // Before
 * const x = undefined
 * return undefined
 * if (x === undefined) {}
 *
 * // After
 * const x = void 0
 * return void 0
 * if (x === void 0) {}
 *
 * // NOT changed (type annotations)
 * let x: undefined
 * type T = string | undefined
 * function fn(): undefined {}
 */
const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Prefer `void 0` over `undefined` in value positions',
      recommended: false,
    },
    fixable: 'code',
    schema: [],
    messages: {
      preferVoidZero: 'Use `void 0` instead of `undefined`',
    },
  },
  create(context) {
    /**
     * Check if the node is in a type annotation context
     * This includes:
     * - Type annotations (: undefined)
     * - Type parameters (<T = undefined>)
     * - Type aliases (type T = undefined)
     * - Interface members
     * - Generic type arguments
     * - Return type annotations
     * - Parameter type annotations
     * - as expressions type part
     */
    function isInTypeContext(node: Rule.Node): boolean {
      let current: Rule.Node | null = node

      while (current) {
        const parent = current.parent

        if (!parent) break

        // Direct type annotation contexts
        if (
          parent.type === 'TSTypeAnnotation' ||
          parent.type === 'TSTypeAliasDeclaration' ||
          parent.type === 'TSInterfaceDeclaration' ||
          parent.type === 'TSTypeParameterDeclaration' ||
          parent.type === 'TSTypeParameterInstantiation' ||
          parent.type === 'TSTypeLiteral' ||
          parent.type === 'TSPropertySignature' ||
          parent.type === 'TSMethodSignature' ||
          parent.type === 'TSIndexSignature' ||
          parent.type === 'TSFunctionType' ||
          parent.type === 'TSConstructorType' ||
          parent.type === 'TSMappedType' ||
          parent.type === 'TSConditionalType' ||
          parent.type === 'TSInferType' ||
          parent.type === 'TSTypeQuery' ||
          parent.type === 'TSTypePredicate'
        ) {
          return true
        }

        // Union/Intersection types
        if (parent.type === 'TSUnionType' || parent.type === 'TSIntersectionType') {
          return true
        }

        // TSUndefinedKeyword is always a type
        if (parent.type === 'TSUndefinedKeyword') {
          return true
        }

        // TSAsExpression - check if we're in the type part
        if (parent.type === 'TSAsExpression') {
          const asExpr = parent as Rule.Node & {typeAnnotation: Rule.Node}
          if (asExpr.typeAnnotation === current) {
            return true
          }
        }

        // TSSatisfiesExpression - check if we're in the type part
        if (parent.type === 'TSSatisfiesExpression') {
          const satisfiesExpr = parent as Rule.Node & {typeAnnotation: Rule.Node}
          if (satisfiesExpr.typeAnnotation === current) {
            return true
          }
        }

        // TSTypeReference - this is a type context
        if (parent.type === 'TSTypeReference') {
          return true
        }

        current = parent
      }

      return false
    }

    /**
     * Check if this is the global `undefined` identifier being used as a value
     */
    function isUndefinedValue(node: Rule.Node): boolean {
      if (node.type !== 'Identifier') return false

      const id = node as Rule.Node & {name: string}
      if (id.name !== 'undefined') return false

      // Skip if in type context
      if (isInTypeContext(node)) return false

      // Skip if it's a property key (not value)
      const parent = node.parent
      if (parent?.type === 'Property') {
        const prop = parent as Rule.Node & {key: Rule.Node; shorthand: boolean}
        // If it's a shorthand property, it's both key and value - should fix
        // If it's a non-shorthand key, skip
        if (prop.key === node && !prop.shorthand) return false
      }

      // Skip if it's being declared/assigned to (left side of assignment)
      if (parent?.type === 'AssignmentExpression') {
        const assign = parent as Rule.Node & {left: Rule.Node}
        if (assign.left === node) return false
      }

      // Skip if it's a variable declarator id (being declared)
      if (parent?.type === 'VariableDeclarator') {
        const decl = parent as Rule.Node & {id: Rule.Node}
        if (decl.id === node) return false
      }

      // Skip if it's a function parameter name
      if (parent?.type === 'FunctionDeclaration' || parent?.type === 'FunctionExpression' || parent?.type === 'ArrowFunctionExpression') {
        const fn = parent as Rule.Node & {params: Rule.Node[]}
        if (fn.params.includes(node)) return false
      }

      // Skip if it's an import/export specifier
      if (
        parent?.type === 'ImportSpecifier' ||
        parent?.type === 'ImportDefaultSpecifier' ||
        parent?.type === 'ImportNamespaceSpecifier' ||
        parent?.type === 'ExportSpecifier'
      ) {
        return false
      }

      // Skip member expression property (obj.undefined)
      if (parent?.type === 'MemberExpression') {
        const member = parent as Rule.Node & {property: Rule.Node; computed: boolean}
        if (member.property === node && !member.computed) return false
      }

      return true
    }

    return {
      Identifier(node) {
        if (!isUndefinedValue(node)) return

        context.report({
          node,
          messageId: 'preferVoidZero',
          fix(fixer) {
            return fixer.replaceText(node, 'void 0')
          },
        })
      },
    }
  },
}

export default rule

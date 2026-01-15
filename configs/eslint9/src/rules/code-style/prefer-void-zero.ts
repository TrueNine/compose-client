import type {Rule} from 'eslint'

/**
 * ESLint rule: prefer-void-zero
 *
 * Detects and fixes `undefined` to `void 0` in value positions.
 * Only fixes value-level `undefined`, NOT type annotations.
 */
const directTypeContexts = new Set(['TSTypeAnnotation', 'TSTypeAliasDeclaration', 'TSInterfaceDeclaration', 'TSTypeParameterDeclaration', 'TSTypeParameterInstantiation', 'TSTypeLiteral', 'TSPropertySignature', 'TSMethodSignature', 'TSIndexSignature', 'TSFunctionType', 'TSConstructorType', 'TSMappedType', 'TSConditionalType', 'TSInferType', 'TSTypeQuery', 'TSTypePredicate'])
const importExportTypes = new Set(['ImportSpecifier', 'ImportDefaultSpecifier', 'ImportNamespaceSpecifier', 'ExportSpecifier'])

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {description: 'Prefer `void 0` over `undefined` in value positions', recommended: false},
    fixable: 'code',
    schema: [],
    messages: {preferVoidZero: 'Use `void 0` instead of `undefined`'},
  },
  create(context) {
    function isInTypeContext(node: Rule.Node): boolean { /* Check if the node is in a type annotation context */
      let current: Rule.Node | null = node
      while (current) {
        const {parent} = current as Rule.Node & {parent?: Rule.Node}
        if (parent === void 0 || parent === null) break
        const parentType = parent.type as string /* 使用 string 类型来绕过 TypeScript 的类型检查 */

        if (directTypeContexts.has(parentType)) return true
        if (parentType === 'TSUnionType' || parentType === 'TSIntersectionType') return true /* Union/Intersection types */
        if (parentType === 'TSUndefinedKeyword') return true /* TSUndefinedKeyword is always a type */

        if (parentType === 'TSAsExpression') { /* TSAsExpression - check if we're in the type part */
          const asExpr = parent as Rule.Node & {typeAnnotation: Rule.Node}
          if (asExpr.typeAnnotation === current) return true
        }

        if (parentType === 'TSSatisfiesExpression') { /* TSSatisfiesExpression - check if we're in the type part */
          const satisfiesExpr = parent as Rule.Node & {typeAnnotation: Rule.Node}
          if (satisfiesExpr.typeAnnotation === current) return true
        }
        if (parentType === 'TSTypeReference') return true /* TSTypeReference - this is a type context */
        current = parent
      }
      return false
    }

    function isUndefinedValue(node: Rule.Node): boolean { /* Check if this is the global `undefined` identifier being used as a value */
      if (node.type !== 'Identifier') return false
      const id = node as Rule.Node & {name: string}
      if (id.name !== 'undefined') return false

      if (isInTypeContext(node)) return false /* Skip if in type context */

      const {parent} = node /* Skip if it's a property key (not value) */
      if (parent?.type === 'Property') {
        const prop = parent as Rule.Node & {key: Rule.Node, shorthand: boolean}
        if (prop.key === node && !prop.shorthand) return false
      }
      if (parent?.type === 'AssignmentExpression') { /* Skip if it's being declared/assigned to */
        const assign = parent as Rule.Node & {left: Rule.Node}
        if (assign.left === node) return false
      }
      if (parent?.type === 'VariableDeclarator') { /* Skip if it's a variable declarator id */
        const decl = parent as Rule.Node & {id: Rule.Node}
        if (decl.id === node) return false
      }
      if (['FunctionDeclaration', 'FunctionExpression', 'ArrowFunctionExpression'].includes(parent?.type ?? '')) { /* Skip if it's a function parameter name */
        const fn = parent as Rule.Node & {params: Rule.Node[]}
        if (fn.params.includes(node)) return false
      }
      if (parent?.type && importExportTypes.has(parent.type as string)) return false /* Skip if it's an import/export specifier */
      if (parent?.type !== 'MemberExpression') return true /* Skip member expression property (obj.undefined) */

      const member = parent as Rule.Node & {property: Rule.Node, computed: boolean}
      if (member.property === node && !member.computed) return false
      return true
    }

    return {
      Identifier(node) {
        if (!isUndefinedValue(node)) return
        context.report({node, messageId: 'preferVoidZero', fix: fixer => fixer.replaceText(node, 'void 0')})
      },
    }
  },
}

export default rule

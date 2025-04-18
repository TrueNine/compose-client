import eslint9 from '@compose/eslint9-config'

export default eslint9({
  type: 'lib',
  ignores: ['__tests__/**/*.spec.ts'],
  typescript: {
    strictTypescriptEslint: true,
    tsconfigPath: './tsconfig.node.json',
  },
})

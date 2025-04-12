import eslint9 from '@compose/eslint9-config'

export default eslint9({
  type: 'lib',
  typescript: {
    strictTypescriptEslint: true,
    tsconfigPath: './tsconfig.node.json',
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.json', './tsconfig.vitest.json'],
      tsconfigRootDir: '.',
      sourceType: 'module',
    }
  }
})

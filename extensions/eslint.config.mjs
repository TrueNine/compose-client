import eslint9 from '@compose/eslint9-config'

export default eslint9({
  type: 'lib',
  typescript: {
    strictTypescriptEslint: true,
    tsconfigPath: './tsconfig.extensions.json',
    parserOptions: {
      project: ['./tsconfig.extensions.json', './tsconfig.json'],
      tsconfigRootDir: '.',
      sourceType: 'module',
    },
  },
})

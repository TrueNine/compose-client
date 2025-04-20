import eslint9 from '@compose/eslint9-config'

export default eslint9({
  test: true,
  typescript: {
    strictTypescriptEslint: true,
    tsconfigPath: './tsconfig.json',
  },
})

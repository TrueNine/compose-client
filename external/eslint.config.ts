import eslint9 from '@compose/eslint9-config'

export default eslint9({
  typescript: {
    strictTypescriptEslint: true,
    tsconfigPath: './tsconfig.json',
  },
})

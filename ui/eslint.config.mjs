import eslint9 from '@compose/eslint9-config'

export default eslint9({
  type: 'lib',
  unocss: true,
  vue: true,
  jsx: true,
  formatters: true,
  typescript: {
    strictTypescriptEslint: true,
    tsconfigPath: './tsconfig.json',
  },
})

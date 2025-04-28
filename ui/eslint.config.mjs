import eslint9 from '@compose/eslint9-config'

export default eslint9({
  unocss: true,
  vue: true,
  jsx: true,
  formatters: true,
  javascript: {
    overrides: {
      'no-console': 'off',
    },
  },
  typescript: {
    strictTypescriptEslint: true,
    tsconfigPath: './tsconfig.json',
    overrides: {
      'ts/no-unsafe-assignment': 'off',
      'ts/no-unsafe-call': 'off',
      'ts/no-unsafe-member-access': 'off',
      'ts/no-unsafe-argument': 'off',
      'ts/no-unsafe-return': 'off',
      'ts/no-unsafe-function-type': 'off',
      'ts/no-unsafe-return': 'off'
    },
  },
})

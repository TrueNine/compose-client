import eslint10 from '@truenine/eslint10-config'

export default eslint10({
  type: 'lib',
  unocss: true,
  vue: true,
  jsx: true,
  formatters: true,
  typescript: {strictTypescriptEslint: true, tsconfigPath: './tsconfig.json'},
  ignores: [
    'playground/**/*'
  ]
})

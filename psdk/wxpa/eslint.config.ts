import eslint10 from '@truenine/eslint10-config'

export default eslint10({
  type: 'lib',
  typescript: {
    strictTypescriptEslint: true,
    tsconfigPath: './tsconfig.lib.json'
  },
  ignores: ['src/examples/**/*']
})

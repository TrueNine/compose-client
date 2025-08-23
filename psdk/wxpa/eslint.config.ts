import eslint9 from '@truenine/eslint9-config'

export default eslint9({
  type: 'lib',
  typescript: {
    strictTypescriptEslint: true,
    tsconfigPath: './tsconfig.lib.json',
  },
  ignores: ['src/examples/**/*'],
})

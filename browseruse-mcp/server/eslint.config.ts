import eslint9 from '@truenine/eslint9-config'

export default eslint9({test: true, typescript: {strictTypescriptEslint: true, tsconfigPath: './tsconfig.lib.json'}})

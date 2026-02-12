import eslint10 from '@truenine/eslint10-config'

export default eslint10({test: true, typescript: {strictTypescriptEslint: true, tsconfigPath: './tsconfig.lib.json'}})

import eslint9 from './src/index'

export default eslint9({
  type: 'lib',
  pnpm: true,
  test: true,
  ignores: ['README.md'],
  typescript: {strictTypescriptEslint: true,
    tsconfigPath: './tsconfig.json'},
})

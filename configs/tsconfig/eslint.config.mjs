import eslint9 from '@compose/eslint9-config'

export default eslint9({
  pnpm: true,
  ignores: [
    '**/*',
    '!vitest.workspace.ts',
    '!package.json',
    '!pnpm-workspace.yaml',
  ],
})

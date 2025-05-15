import { antfu } from '@antfu/eslint-config'

export default antfu({
  pnpm: false,
  ignores: [
    '**/*',
    '!vitest.workspace.ts',
    '!package.json',
    '!pnpm-workspace.yaml',
  ],
})

import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  './req/vitest.config.ts',
  './external/vitest.config.ts',
  './ui/vitest.config.ts',
  './shared/vitest.config.ts',
])

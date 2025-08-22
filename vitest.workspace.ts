import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  './ui/vitest.config.ts',
  './vue/vitest.config.ts',
  './req/vitest.config.ts',
  './types/vite.config.ts',
  './shared/vitest.config.ts',
  './external/vitest.config.ts',
  './design/vitest.config.ts',
  './configs/vite/vite.config.ts',
  './configs/eslint9/vite.config.ts',
  './configs/uno/vite.config.ts',
  './ext/chrome/vite.config.ts',
  './psdk/wxpa/vite.config.ts',
  './psdk/tmap/vite.config.ts',
])

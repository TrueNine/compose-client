import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  "./req/vitest.config.ts",
  "./extensions/vitest.config.ts",
  "./meta-ui-web/vitest.config.ts",
  "./api-types/vite.config.ts",
  "./api-model/vite.config.ts",
  "./configs/uno/vite.config.ts",
  "./configs/eslint9/vite.config.ts",
  "./platform-sdk/wxpa/vite.config.ts",
  "./configs/vite-fragment/vite.config.ts",
  "./platform-sdk/tmap/vite.config.ts",
  "./ext/chrome/vite.config.ts"
])

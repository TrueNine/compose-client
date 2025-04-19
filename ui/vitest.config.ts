import { fileURLToPath } from 'node:url'

import { configDefaults, defineConfig, mergeConfig } from 'vitest/config'

import viteConfig from './vite.config.ts'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      deps: {
        optimizer: {
          web: {
            include: ['vuetify', 'element-plus'],
          },
        },
        inline: ['vuetify', 'element-plus'],
      },
      environment: 'edge-runtime',
      exclude: [...configDefaults.exclude, 'e2e/*'],
      root: fileURLToPath(new URL('./', import.meta.url)),
    },
  }),
)

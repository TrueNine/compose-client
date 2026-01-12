import type {InlineConfig} from 'vitest'
import {resolve} from 'node:path'
import {mergeConfig} from 'vite'
import {defineConfig} from 'vitest/config'
import {e as viteConfig} from './vite.config'

const vitestConfig = defineConfig({
  resolve: {alias: {'@': resolve(__dirname, './src')}},
  test: {
    environment: 'happy-dom',
    globals: false,
    setupFiles: [],
  },
})

const mergedConfig: InlineConfig = mergeConfig(viteConfig, vitestConfig)

export default mergedConfig

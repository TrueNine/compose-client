import {createLibraryVitestConfig} from '@truenine/config-vite/workspace-config'
import {defineConfig} from 'vitest/config'
import {e as viteConfig} from './vite.config'

const mergedConfig = createLibraryVitestConfig(import.meta, viteConfig, {
  environment: 'happy-dom',
  overrides: defineConfig({test: {globals: false, setupFiles: []}})
})

export default mergedConfig

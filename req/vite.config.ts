import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    sourcemap: true,
    lib: {
      fileName: '[name]',
      entry: 'src/index.ts',
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      output: {
        preserveModulesRoot: 'src',
        preserveModules: true
      },
      external: ['net', '@stomp/stompjs', 'stompjs', '@compose/api-model', '@compose/api-types', 'sockjs-client']
    }
  },
  plugins: [
    dts({
      staticImport: true,
      tsconfigPath: './tsconfig.json',
      exclude: ['dist/**', '__build-src__/**', 'vite.config.ts', '**/__tests__/**', 'vitest.config.ts']
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})

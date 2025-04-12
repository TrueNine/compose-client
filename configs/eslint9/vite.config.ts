import { fileURLToPath, URL } from 'node:url'
import { manifest } from '@compose/config-vite-fragment'

const { defineConfig } = manifest({
  pushFeatures: {
    lib: {
      externals: [
        '@eslint/js',
        '@rushstack/eslint-patch',
        'typescript-eslint',
        'eslint-plugin-vue',
        'vue-eslint-parser',
      ]
    }
  },
  features: {
    entry: ['index', 'types/index', 'defaults/index'],
    lang: 'ts',
    lib: {
      formats: ['es', 'cjs'],
      sourcemap: false
    }
  }
})

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})

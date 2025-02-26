import {fileURLToPath, URL} from 'node:url'
import {manifest} from '@compose/config-vite-fragment'

const {defineConfig} = manifest({
  pushFeatures: {
    lib: {
      externals: [
        '@eslint/js',
        'globals',
        '@rushstack/eslint-patch',
        'typescript-eslint',
        'eslint-plugin-vue',
        'vue-eslint-parser',
        /^(eslint-plugin-prettier|eslint-plugin-prettier\/)/
      ]
    }
  },
  features: {
    entry: ['index'],
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

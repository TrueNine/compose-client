import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {resolve} from 'path'
import dts from 'vite-plugin-dts'

export default defineConfig({
  build: {
    lib: {
      entry: './main.ts',
      name: 'ykit-ui'
    },
    outDir: 'dist',
    rollupOptions: {
      external: ['vue'],
      input: ['main.ts'],
      output: [
        {
          format: 'es',
          entryFileNames: '[name].mjs',
          preserveModules: true,
          exports: 'named',
          dir: '../dist/es'
        },
        {
          format: 'cjs',
          entryFileNames: '[name].js',
          preserveModules: true,
          exports: 'named',
          dir: '../dist/lib'
        }
      ]
    }
  },
  plugins: [
    vue(),
    dts({
      entryRoot: './src',
      outDir: ['dist/es/src', '../dist/lib/src'],
      cleanVueFileName: true
    })
  ]
})

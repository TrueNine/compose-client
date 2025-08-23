import type { UserConfig } from 'tsdown'
import { defineConfig } from 'tsdown'

const config: UserConfig = defineConfig({
  entry: [
    './src/index.ts',
    './src/vite-plugin-dts/index.ts',
    './src/vite-plugin-package-json/index.ts',
    './src/externals/index.ts',
    './src/excludes/index.ts',
    './src/lib/index.ts',
  ],
  tsconfig: './tsconfig.lib.json',
  platform: 'node',
  sourcemap: true,
  fromVite: true,
  unbundle: true,
  format: ['cjs', 'esm'],
  exports: {
    all: false,
  },
  dts: {
    sourcemap: true,
  },
})

export default config

import type { UserConfig } from 'tsdown'
import { defineConfig } from 'tsdown'

const config: UserConfig = defineConfig({
  entry: ['./src/index.ts'],
  platform: 'neutral',
  sourcemap: true,
  unbundle: true,
  format: ['esm'],
  exports: {
    all: false,
  },
  dts: {
    sourcemap: true,
  },
})

export default config

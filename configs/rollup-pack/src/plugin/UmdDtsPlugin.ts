import type {Plugin} from 'rollup'

import type {CustomRollupConfig} from '../CustomRollupConfig'

import {umdGlobalDtsTemplateFill} from './UmdDtsTemplate'

export function umdDtsPlugin(config: CustomRollupConfig): Plugin {
  return {
    name: 'rollup-plugin-compose-umd-dts',
    async generateBundle(o) {
      const f = await import('fs')
      const outputPath = o.dir || o.file
      const textContent = umdGlobalDtsTemplateFill(config)
      f.writeFileSync(`${outputPath}/${config.umd?.dtsIndexName}.d.ts`, textContent)
    },
    async closeBundle() {}
  }
}

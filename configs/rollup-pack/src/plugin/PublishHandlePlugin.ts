import type {Plugin} from 'rollup'

import type {CustomRollupConfig} from '../CustomRollupConfig'

export function publishHandlePlugin(config: CustomRollupConfig): Plugin {
  return {
    name: 'compose-publish',
    async buildEnd() {
      const p = await import('path')
      const f = await import('fs')

      const rootDir = p.resolve('./')
      const dist = p.resolve(rootDir, config.distRoot)

      const json = p.resolve(rootDir, config.pub.packageJsonPath!)
      if (f.existsSync(json)) {
        const jsonText = f.readFileSync(json).toString('utf-8')
        const outPath = p.resolve(dist, 'package.json')
        if (!f.existsSync(p.dirname(outPath))) f.mkdirSync(p.dirname(outPath))
        f.writeFileSync(outPath, producePackageJson(jsonText, config))
      }

      const readme = p.resolve(rootDir, config.pub.readmePath!)
      if (f.existsSync(readme)) f.copyFileSync(readme, p.resolve(dist, `${config.pub.readmePath}`))
    }
  }
}

export function producePackageJson(json: string, cfg: CustomRollupConfig): string {
  const a = cleanPackageJson(JSON.parse(json))
  const info = getPackageFileInfo(cfg)
  return JSON.stringify(Object.assign(a, info), null, 2)
}

export function cleanPackageJson(json: object) {
  const j = json as never

  delete j['scripts']

  delete j['type']

  delete j['types']
  delete j['main']
  delete j['module']

  delete j['exports']

  return j
}

export function getPackageFileInfo(cfg: CustomRollupConfig) {
  const entryName = cfg.entryFileName.split('.')[0]
  const dts = `./${cfg.dtsBuildDistDirName}/${entryName}.d.ts`
  const im = `./${cfg.esModuleBuildDistDirName}/${entryName}.${cfg.esModuleBuildFileSuffix}`
  const re = `./${cfg.commonjsBuildDistDirName}/${entryName}.${cfg.commonjsBuildFileSuffix}`

  return {
    scripts: {
      pub: 'pnpm publish --no-git-checks'
    },
    type: 'module',
    main: `${cfg.commonjsBuildDistDirName}/${entryName}.${cfg.commonjsBuildFileSuffix}`,
    module: `${cfg.esModuleBuildDistDirName}/${entryName}.${cfg.esModuleBuildFileSuffix}`,
    types: `${cfg.dtsBuildDistDirName}/${entryName}.d.ts`,
    exports: {
      '.': {
        types: dts,
        import: im,
        require: re
      },
      [`./${cfg.esModuleBuildDistDirName}`]: {
        types: dts,
        import: im
      },
      [`./${cfg.commonjsBuildDistDirName}`]: {
        types: dts,
        require: re
      },
      [`./${cfg.umdBuildDistDirName}`]: {
        types: `./${cfg.umdBuildDistDirName}/${cfg.umd.dtsIndexName}.d.ts`,
        import: `./${cfg.umdBuildDistDirName}/${cfg.umd.fileName}.${cfg.umdBuildFileSuffix}`,
        require: `./${cfg.umdBuildDistDirName}/${cfg.umd.fileName}.${cfg.umdBuildFileSuffix}`
      },
      './*': './*'
    }
  }
}

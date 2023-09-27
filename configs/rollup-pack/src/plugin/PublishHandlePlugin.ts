import type {Plugin} from 'rollup'

import {Node} from '../adaptors/PackageAdaptor'
import type {KnownAny} from '../adaptors/PackageAdaptor'
import type {CustomRollupConfig} from '../CustomRollupConfig'
import {findWorkspaceVersions} from '../pnpm'

export function publishHandlePlugin(config: CustomRollupConfig): Plugin {
  return {
    name: 'compose-publish',
    async buildEnd() {
      const p = await import('path')
      const f = await import('fs')
      const rootDirPath = p.resolve('./')
      const distPath = p.resolve(rootDirPath, config.distRoot)
      const packageJsonPath = p.resolve(rootDirPath, config.pub.packageJsonPath!)

      if (f.existsSync(packageJsonPath)) {
        const jsonText = f.readFileSync(packageJsonPath, {encoding: 'utf-8'})
        const json = JSON.parse(jsonText) as KnownAny

        let result = cleanPackageJson(json)
        result = producePackageJson(json, config)

        result = await parsePnpmWorkspaceVersion(result, rootDirPath)
        result = await parsePnpmWorkspaceVersion(result, rootDirPath)

        const distJsonPath = p.resolve(distPath, 'package.json')
        await Node.writeContentToFile(distJsonPath, JSON.stringify(result, null, 2))
      }

      const readme = p.resolve(rootDirPath, config.pub.readmePath!)
      if (f.existsSync(readme)) f.copyFileSync(readme, p.resolve(distPath, `${config.pub.readmePath}`))
    }
  }
}

export function producePackageJson(json: KnownAny, cfg: CustomRollupConfig): KnownAny {
  const info = generatePackagePublishInfo(cfg)
  return Object.assign(json, info)
}

export function cleanPackageJson(json: KnownAny): KnownAny {
  const j = json as KnownAny

  delete j['scripts']

  delete j['type']

  delete j['types']
  delete j['main']
  delete j['module']

  delete j['exports']

  return j
}

export function generatePackagePublishInfo(cfg: CustomRollupConfig): KnownAny {
  const entryName = cfg.entryFileName.split('.')[0]
  const dts = `./${cfg.dtsDistDir}/${entryName}.d.ts`
  const im = `./${cfg.esDistDir}/${entryName}.${cfg.esExtension}`
  const re = `./${cfg.cjsDistDir}/${entryName}.${cfg.cjsExtension}`

  return {
    scripts: {
      pub: 'pnpm i && pnpm publish --no-git-checks'
    },
    type: 'module',
    main: `${cfg.cjsDistDir}/${entryName}.${cfg.cjsExtension}`,
    module: `${cfg.esDistDir}/${entryName}.${cfg.esExtension}`,
    types: `${cfg.dtsDistDir}/${entryName}.d.ts`,
    exports: {
      '.': {
        types: dts,
        import: im,
        require: re
      },
      [`./${cfg.esDistDir}`]: {
        types: dts,
        import: im
      },
      [`./${cfg.esDistDir}/*.${cfg.esExtension}`]: {
        types: `./${cfg.esDistDir}/*.d.ts`,
        import: `./${cfg.esDistDir}/*.${cfg.esExtension}`
      },
      [`./${cfg.esDistDir}/*`]: {
        types: [`./${cfg.dtsDistDir}/*.d.ts`, `./${cfg.dtsDistDir}/*/${entryName}.d.ts`],
        import: `./${cfg.esDistDir}/*.${cfg.esExtension}`
      },
      [`./${cfg.cjsDistDir}`]: {
        types: dts,
        require: re
      },
      [`./${cfg.cjsDistDir}/*.${cfg.cjsExtension}`]: {
        types: `./${cfg.dtsDistDir}/*.d.ts`,
        require: `./${cfg.cjsDistDir}/*.${cfg.cjsExtension}`
      },
      [`./${cfg.cjsDistDir}/*`]: {
        types: [`./${cfg.dtsDistDir}/*.d.ts`, `./${cfg.dtsDistDir}/*/${entryName}.d.ts`],
        require: `./${cfg.cjsDistDir}/*.${cfg.cjsExtension}`
      },
      [`./${cfg.umdBuildDistDirName}`]: {
        types: `./${cfg.umdBuildDistDirName}/${cfg.umd.dtsIndexName}.d.ts`,
        import: `./${cfg.umdBuildDistDirName}/${cfg.umd.fileName}.${cfg.umdBuildFileSuffix}`,
        require: `./${cfg.umdBuildDistDirName}/${cfg.umd.fileName}.${cfg.umdBuildFileSuffix}`
      },
      './*': './*'
    },
    unpkg: `${cfg.umdBuildDistDirName}/${cfg.umd?.fileName}.${cfg.umdBuildFileSuffix}`,
    jsdelivr: `${cfg.umdBuildDistDirName}/${cfg.umd?.fileName}.${cfg.umdBuildFileSuffix}`
  }
}

export async function parsePnpmWorkspaceVersion(json: KnownAny, rootDir: string): Promise<KnownAny> {
  const versions = await findWorkspaceVersions(rootDir)

  function _replaceWorkspaceVersion(dependenciesKey: string) {
    if (json[dependenciesKey]) {
      const dependencies = json[dependenciesKey] as Record<string, string>
      for (const [key, value] of Object.entries(dependencies)) {
        if (value.includes('workspace') && versions[key]) {
          dependencies[key] = `^${versions[key].version}`
        }
      }
      json[dependenciesKey] = dependencies
    }
  }

  _replaceWorkspaceVersion('dependencies')
  _replaceWorkspaceVersion('devDependencies')
  _replaceWorkspaceVersion('peerDependencies')

  return json
}

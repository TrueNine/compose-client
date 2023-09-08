import {Node} from '@compose/api-model'

export async function findWorkspaceVersions(rootDir: string) {
  const p = await import('path')
  const f = await import('fs')
  const pnpmListJson = (await Node.executeJson<PnpmListJson[]>(`pnpm list -j`, p.resolve(rootDir)))!

  const versions = pnpmListJson
    .map(e => {
      return {
        ...e.dependencies,
        ...e.devDependencies,
        ...e.unsavedDependencies
      }
    })
    .reduce((acc, cur) => Object.assign(acc, cur), {})

  Object.keys(versions).forEach(k => {
    const v = versions[k]
    if (v.version.includes('link:')) {
      const json = p.resolve(rootDir, v.version.replace('link:', ''), 'package.json')
      versions[k].version = JSON.parse(f.readFileSync(json, {encoding: 'utf-8'})).version
    }
  })
  return versions
}

export interface PnpmListJsonDependency {
  from: string
  version: string
  path: string
  resolved?: string
}

export interface PnpmListJson {
  name: string
  version: string
  path: string
  private: boolean
  devDependencies: {
    [dependencyName: string]: PnpmListJsonDependency
  }
  dependencies: {
    [dependencyName: string]: PnpmListJsonDependency
  }
  unsavedDependencies: {
    [dependencyName: string]: PnpmListJsonDependency
  }
}

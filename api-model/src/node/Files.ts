import type fsType from 'node:fs'
import type pathType from 'node:path'
import type childProcessType from 'node:child_process'

import type {Nullable} from '@compose/compose-types'

import type {KnownAny} from '../tools'

export class Node {
  static async executeJson<T = KnownAny>(cmd: string, cwd?: string): Promise<Nullable<T>> {
    const a = await this.execute(cmd, cwd)
    return a == null ? null : JSON.parse(a)
  }

  static async execute(cmd: string, cwd?: string): Promise<Nullable<string>> {
    const {execSync} = await this.dynamicChildProcess()
    if (!cwd) cwd = (await this.dynamicPath()).resolve('./')
    return execSync(cmd, {cwd: cwd, encoding: 'utf-8'})
  }

  static async writeContentToFile(dest: string, content: string) {
    const f = await this.dynamicFs()
    const p = await this.dynamicPath()
    await this.mkDir(p.resolve(dest))
    await f.writeFileSync(p.resolve(dest), content, {encoding: 'utf-8'})
  }

  static async mkDir(path: string) {
    const f = await this.dynamicFs()
    const p = await this.dynamicPath()
    const findPath = p.resolve(path)
    const dir = p.dirname(findPath)
    if (!f.existsSync(findPath)) {
      if (!f.existsSync(dir)) f.mkdirSync(dir)
    }
  }

  static async fullPaths(...paths: string[]): Promise<string> {
    return (await this.dynamicPath()).resolve(...paths)
  }

  static async dynamicFs(): Promise<typeof fsType> {
    return import('node:fs')
  }

  static async dynamicChildProcess(): Promise<typeof childProcessType> {
    return import('node:child_process')
  }

  static async dynamicPath(): Promise<typeof pathType> {
    return import('node:path')
  }
}

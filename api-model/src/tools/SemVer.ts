/**
 * # 版本号管理工具
 */
export class SemVer {
  private readonly _version: string
  private readonly _major: number
  private readonly _minor: number
  private readonly _patch: number

  constructor(version: string) {
    this._version = version
    const mmp = version.trim().split('.').map(Number.parseInt)
    this._major = mmp[0]
    this._minor = mmp[1]
    this._patch = mmp[2]
  }

  addPatch(): string {
    return `${this._major.toString()}.${this._minor.toString()}.${(this._patch + 1).toString()}`
  }

  addMinor(): string {
    return `${this._major.toString()}.${(this._minor + 1).toString()}.${this._patch.toString()}`
  }

  addMajor(): string {
    return `${(this._major + 1).toString()}.${this._minor.toString()}.${this._patch.toString()}`
  }

  get major(): number {
    return this._major
  }

  get minor(): number {
    return this._minor
  }

  get patch(): number {
    return this._patch
  }

  get metaVersion(): string {
    return this._version
  }
}

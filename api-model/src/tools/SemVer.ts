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
    const mmp = version.trim().split('.').map(parseInt)
    this._major = mmp[0]
    this._minor = mmp[1]
    this._patch = mmp[2]
  }

  addPatch() {
    return `${this._major.toString()}.${this._minor.toString()}.${(this._patch + 1).toString()}`
  }

  addMinor() {
    return `${this._major.toString()}.${(this._minor + 1).toString()}.${this._patch.toString()}`
  }

  addMajor() {
    return `${(this._major + 1).toString()}.${this._minor.toString()}.${this._patch.toString()}`
  }

  get major() {
    return this._major
  }

  get minor() {
    return this._minor
  }

  get patch() {
    return this._patch
  }

  get metaVersion() {
    return this._version
  }
}

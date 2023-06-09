export class SearchParam {
  private _root: Map<string, string> = new Map()

  toString(): string {
    return Array.from(this._root)
      .map(([k, v]) => `${k}=${v}`)
      .join(`&`)
  }

  append(name: string, value: string) {
    this._root.set(name, value)
  }
}

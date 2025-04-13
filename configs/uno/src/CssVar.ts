// --stepNodes-e: #abcd
export class CssVar {
  private readonly _name: string
  private readonly _value: string

  /**
   * @param name 不需要在前面加上 --
   * @param value 变量的值
   */
  constructor(name: string, value: string) {
    this._name = `--${name}`
    this._value = value
  }

  get defineCssVar(): string {
    return `${this.varName}: ${this.varValue};`
  }

  get varValue(): string {
    return this._value
  }

  get useVar(): string {
    return `var(${this.varName})`
  }

  get varName(): string {
    return this._name
  }

  toString(): string {
    return this.defineCssVar
  }
}

export type ColorHex = `#${string}`
export type ScssVarName = `$${string}`
export type ScssVarAndValue = `${ScssVarName}: ${string};`

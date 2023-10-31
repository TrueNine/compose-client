/**
 * scss变量名
 */
export type ScssVariableDefs = Record<`$${string}`, `${string | number};`>

/**
 * 颜色值
 */
export type HexColor = `#${string}`

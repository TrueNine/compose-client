/**
 * ## 布尔值简写
 */
export type Bool = boolean

/**
 * ## 二进制数
 */
export type Binary = bool | byte
export type binary = Binary

/**
 * ## 整数的别名
 */
export type Int = number
export type int = number

/**
 * ## 大整数的别名
 */
export type Long = number
export type long = Long

/**
 * 大数，用于相加或随机增加的大数值
 */
export type BigSerial = Long
export type bigserial = BigSerial

/**
 * 表示一个很小的数值
 */
export type Byte = number
export type byte = Byte

/**
 * ## 小数的别名
 */
export type Float = number
export type float = Float

/**
 * ## 小数的别名
 */
export type Double = number
export type double = Double

/**
 * ## 大型高精度小数的别名
 */
export type Decimal = number
export type decimal = Decimal

// === rust 简短类型定义
export type bool = Bool
export type u8 = Byte
export type u16 = Int
export type u32 = Int
export type u64 = Long
export type u128 = BigSerial
export type usize = Int
export type i8 = Byte
export type i16 = Int
export type i32 = Int
export type i64 = Long
export type i128 = BigSerial
export type isize = Int
export type f32 = Float
export type f64 = Double
export type char = string
export type str = string

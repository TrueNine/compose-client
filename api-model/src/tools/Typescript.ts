/**
 * 已知的任意类型，用于某些时候骗过编译器
 * eslint-disable-next-line
 */
export type KnownAny = any

export type Pt<T> = Partial<T>
export type Rq<T> = Required<T>

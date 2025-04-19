import type { i32 } from '@compose/types'
import { STRS_ASCII } from '@/consts/index'

export function generateRandomAsciiString(length: i32 = 32): string {
  let s = ''
  if (length <= 0) {
    return s
  }
  for (let i = 0; i < length; i++) {
    s += STRS_ASCII[Math.floor(Math.random() * STRS_ASCII.length)]
  }
  return s
}

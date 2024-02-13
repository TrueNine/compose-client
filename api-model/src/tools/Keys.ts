import type {Int} from '@compose/api-types'
import {STRS_ASCII} from '../consts/Strings'

export class Keys {
  static generateRandomAsciiString(length: Int = 32) {
    let s = ''
    if (length <= 0) return s
    for (let i = 0; i < length; i++) {
      s += STRS_ASCII[Math.floor(Math.random() * STRS_ASCII.length)]
    }
    return s
  }
}

import type {Evr} from '../../enum'
import type {TypeInt} from '../Utils'

/**
 * 性别枚举
 */
export enum GenderTyping {
  /**
   * 男
   */
  MAN = 1,
  /**
   * 女
   */
  WOMAN = 0,
  /**
   * 未知
   */
  UNKNOWN = 2
}

export const GenderTypingComment: Record<Evr<typeof GenderTyping>, string> = {
  [GenderTyping.MAN]: '男',
  [GenderTyping.WOMAN]: '女',
  [GenderTyping.UNKNOWN]: '未知'
}
export const GenderTypingMap: Record<Evr<typeof GenderTyping>, TypeInt> = {
  [GenderTyping.MAN]: 1,
  [GenderTyping.WOMAN]: 0,
  [GenderTyping.UNKNOWN]: 2
}
export const GenderTypingReverseMap: Record<Evr<typeof GenderTyping>, GenderTyping> = {
  [1]: GenderTyping.MAN,
  [0]: GenderTyping.WOMAN,
  [2]: GenderTyping.UNKNOWN
}

import {describe, test, expect} from 'vitest'

import {enumValues} from '@/tools'

enum ConEnum {
  NONE,
  NUM_DEF = 1,
  STR_DEF = 'StringDefine',
  CONF_NUMBER = 444,
  SEPARATOR,
  NUMBER_STRING = '123456'
}

describe('Fns', () => {
  test('test get enum values', () => {
    const a = enumValues(ConEnum)
    console.log(a)
    expect(a.length).toBe(6)

    expect(() => {
      expect(a[0]).toBe(ConEnum.NONE)
      expect(a[1]).toBe(ConEnum.NUM_DEF)
      expect(a[2]).toBeTypeOf('string')
      expect(a[3]).toBe(ConEnum.CONF_NUMBER)
      expect(a[4]).toBe(ConEnum.SEPARATOR)
      expect(a[5]).toBe(ConEnum.NUMBER_STRING)
      expect(a[6]).toBeUndefined()
    }, '枚举返回必须有顺序').not.toThrow()
  })
})

import {describe, test, expect} from 'vitest'
import {promiseAll} from '@/tools'

describe('Asyncs', () => {
  test('promiseAll', async () => {
    const defined = {
      a: 1,
      b: 2,
      c: 'str',
      d: new Promise(resolve => resolve('str'))
    }
    const result = await promiseAll(defined)
    expect(result?.a).toEqual(defined.a)
    expect(result?.b).toEqual(defined.b)
    expect(result?.c).toEqual(defined.c)
    expect(result?.d).toEqual('str')
  })
})

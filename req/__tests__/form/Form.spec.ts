import {describe, expect, test} from 'vitest'

import {form, toFormPathData} from '@/form'

describe('form', () => {
  const testObj = {
    shareCode: '20210903',
    info: {
      account: 'ab',
      password: 'pwd',
      tagMap: {k: 'v', bb: 23},
      genders: ['1', '2', '3'],
      file: new Blob(),
      files: [new Blob(), new Blob()],
      fileMap: {
        e: new Blob(),
        a: new Blob()
      },
      tagMaps: [
        {
          k: 'v',
          bb: 23
        },
        {
          k: 'v',
          bb: 23
        }
      ]
    }
  }

  test('toFormPathData', () => {
    const a = toFormPathData(testObj)
    console.log(a)
  })

  test('has object', () => {
    const result = form(testObj)

    console.log(result)

    for (const key of result.keys()) {
      console.log(key)
    }

    expect(result.has('shareCode')).toBe(true)
    expect(result.has('info.account')).toBe(true)
    expect(result.get('info.account')).toBe('ab')
    expect(result.get('info.password')).toBe('pwd')
  })

  test('form plain', () => {
    const f = form({a: 1, b: '2'})
    console.log(f)

    const f1 = form({
      a: [
        {
          a: 1,
          b: 2
        },
        {
          a: 1,
          b: 2
        }
      ]
    })
    console.log(f1.keys())
    console.log(f1.values())
  })
})

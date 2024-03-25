import {describe, expect, test} from 'vitest'
import {ref} from 'vue'

import {form, toFormPathData} from '@/form'

describe('form', () => {
  const as = {
    id: '7174963791543930880',
    subsidy: '没有规则',
    salaryCommissionRule: '没有规则',
    payday: 1,
    auditStatus: 2,
    contactName: '马良',
    rqCount: 44,
    rqDisRule: new Uint8Array([0, 1, 0, 1, 0, 1]),
    postResp: '没有',
    createDatetime: 1710644772240,
    rqAddressCode: '140321',
    addressCode: '210624',
    minSalary: 500,
    exYear: 0,
    qualification: '没有',
    doc: '没有描述',
    title: '二道贩子',
    endDate: 1711814400000,
    startDate: 1710691200000,
    orderedWight: 0
  }

  test('test uint8array insert 0', () => {
    const a = toFormPathData({
      a: new Uint8Array([0, 1, 0, 1])
    })
    console.log(a)
    expect(a).not.toEqual([{name: 'a', value: '1,1'}])

    const b = toFormPathData(ref(as).value)
    console.log(b)
  })

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

import {describe, expect, test} from 'vitest'

import {deepResolve} from '@/tools'

describe('Values', () => {
  test('deepResolve', () => {
    const obj = {
      id: '7235451660909416448',
      privated: false,
      userInfoId: '7231245295026442240',
      subsidy: '大王的哇大王的',
      salaryCommissionRule: '大王的哇大王的',
      payday: 25,
      auditStatus: 2,
      rqCount: 13,
      rqDisRule: 'AQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQ==',
      postResp: '新测试职位新测试职位新测试职位新测试职位新测试职位',
      createDatetime: 1725066204110,
      addressCode: '11',
      maxSalary: 350,
      minSalary: 304,
      qualification: '123456新测试职位新测试职位新测试职位新测试职位',
      doc: '新测试职位新测试职位',
      title: '新测试职位',
      endDate: 1727625600000,
      startDate: 1725033600000,
      orderedWeight: 0
    }

    const e = deepResolve(obj, {deep: true, resolve: () => 1}, () => true)
    expect(Object.values(e).every(v => v === 1)).toBe(true)
    const r = deepResolve(obj, {resolve: () => 1}, () => true)
    expect(Object.values(r).every(v => v === 1)).toBe(true)

    const x = deepResolve({d: {a: 1}}, {deep: true, resolve: () => 2}, (_, k) => k === 'a')
    console.log(x)
    expect(x).toEqual({d: {a: 2}})
  })
})

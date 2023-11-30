import {test, expect} from 'vitest'

import {CnDistrict} from '../../../references'

test('CnDistrict', () => {
  const a = new CnDistrict('433127100101')
  expect(a.level).toBe(5)
  expect(a.serialArray.length).toBe(5)

  const b = new CnDistrict('43')
  expect(b.level).toBe(1)
  expect(b.serialArray.length).toBe(1)

  const c = new CnDistrict('')
  expect(c.level).toBe(0)
  expect(c.serialArray.length).toBe(0)
})

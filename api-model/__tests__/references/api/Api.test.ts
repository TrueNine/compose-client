import {expect, test} from 'vitest'

import {AddressUtils} from '@/references'

test('CnDistrict', () => {
  const a = new AddressUtils('433127100101')
  expect(a.level).toBe(5)
  expect(a.serialArray.length).toBe(5)

  const b = new AddressUtils('43')
  expect(b.level).toBe(1)
  expect(b.serialArray.length).toBe(1)

  const c = new AddressUtils('')
  expect(c.level).toBe(0)
  expect(c.serialArray.length).toBe(0)
})

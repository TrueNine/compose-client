import {test} from 'vitest'

import {resolveRouters} from '../../src/references/VueRouter'

test('import.meta', () => {
  console.log(import.meta.glob('/**'))
})

test('VueRouter.resolveRouters', () => {
  const a = resolveRouters()
  console.log(a)
})

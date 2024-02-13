import {test} from 'vitest'

import {resolveRouters} from '@/references'

test('import.meta', () => {
  console.log(import.meta.glob('/**'))
})

test('VueRouter.resolveRouters', () => {
  const a = resolveRouters()
  console.log(a)
})

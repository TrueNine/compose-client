import {resolveRouters} from '../../src/references/VueRouter'
import {test} from 'vitest'

test('import.meta', () => {
  console.log(import.meta.glob('/**'))
})

test('VueRouter.resolveRouters', () => {
  const a = resolveRouters()
  console.log(a)
})

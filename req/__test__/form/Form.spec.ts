import {test} from 'vitest'

import {form} from '../../form'

test('form', () => {
  const f = form({a: 1, b: '2'})
  console.log(f)
})

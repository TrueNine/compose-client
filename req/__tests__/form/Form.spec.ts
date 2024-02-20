import {test} from 'vitest'

import {form} from '@/form'

test('form', () => {
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

import {test} from 'vitest'

import {DayJs} from '../../references'

test('test format time millis', () => {
  const a = DayJs.dateMillis('2023-01-01')
  console.log(a)
})

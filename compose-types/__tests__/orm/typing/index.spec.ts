import {test} from 'vitest'

import {RelationItemTyping} from '../../../orm'

test('test enum typing', () => {
  console.log(RelationItemTyping.NONE)
  type a = (typeof RelationItemTyping)[keyof typeof RelationItemTyping]

  const b: a = 1
  console.log(RelationItemTyping[b])
})

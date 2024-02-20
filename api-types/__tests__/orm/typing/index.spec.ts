import {test} from 'vitest'
import {RelationItemTyping} from '@compose/api-model'

test('test enum typing', () => {
  console.log(RelationItemTyping.NONE)
  type a = (typeof RelationItemTyping)[keyof typeof RelationItemTyping]

  const b: a = 1
  console.log(RelationItemTyping[b])
})

enum AE {
  A = '测',
  B = '试'
}

test('test loop typings', () => {
  console.log(Object.entries(RelationItemTyping))
  console.log(RelationItemTyping)
  console.log(Object.entries(AE))
  console.log(AE)
  console.log(RelationItemTyping['0'])
})

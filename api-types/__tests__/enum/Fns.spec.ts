import {test} from 'vitest'
import {enumToOutput, findEnumValue} from '@compose/api-model'

import {RelationItemTyping} from '../../orm'

test('test enum generate output', () => {
  const b = enumToOutput(RelationItemTyping, {
    [RelationItemTyping.NONE]: '',
    '1': '',
    '2': '',
    '3': '',
    '4': '',
    '9999': ''
  })
  console.log(b)
})

test('fine Enum', () => {
  const a = findEnumValue(RelationItemTyping, 1)
  console.log(a)
  console.log(RelationItemTyping['NONE'])
})
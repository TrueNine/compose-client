import * as path from 'node:path'
import {readFileSync} from 'node:fs'

import {describe, test} from 'vitest'

import {extract} from '@/libarchive-js'

describe('test libarchive.js', () => {
  test('test libarchive.js', async () => {
    const filePath = path.resolve(__dirname, '冯雪飞.rar')
    const f = readFileSync(filePath)
    const rarFile = new File([f], 'test.rar')
    console.log(rarFile)

    const r = await extract(rarFile)

    console.log(r)
  })
})

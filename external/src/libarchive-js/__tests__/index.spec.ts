import { readFileSync } from 'node:fs'
import * as path from 'node:path'

import { extract } from '@/libarchive-js'

import { describe, expect, it } from 'vitest'

describe('test libarchive.js', () => {
  it('test libarchive.js', async () => {
    const filePath = path.resolve(__dirname, '冯雪飞.rar')
    const f = readFileSync(filePath)
    const rarFile = new File([f], 'test.rar')

    const r = await extract(rarFile)

    expect(r).toBeDefined()
  })
})

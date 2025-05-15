import { readFileSync } from 'node:fs'
import * as path from 'node:path'

import { describe, expect, it } from 'vitest'

import { extract } from '@/libarchive-js'

describe('test libarchive.js', () => {
  it('test libarchive.js', async () => {
    const filePath = path.resolve(__dirname, '冯雪飞.rar')
    const f = readFileSync(filePath)
    const rarFile = new File([f], 'test.rar')

    const r = await extract(rarFile)

    expect(r).toBeDefined()
  })
})

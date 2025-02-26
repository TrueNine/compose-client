import { readFileSync } from 'node:fs'

import { getImageData } from '@/browser/document'

import { describe, it } from 'vitest'

describe('browser tests', () => {
  it('test getImageData', async () => {
    const f = readFileSync('./__tests__/browser/00.png')
    const b = new Blob([f], { type: 'image/png' })
    const data = await getImageData(b)
    const r = new Promise((resolve) => {
      data.onloadeddata = () => {
        resolve(data)
      }
    })
    await r
  })
})

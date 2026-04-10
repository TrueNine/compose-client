import {describe, expect, it} from 'vitest'

import {getImageData} from '@/browser/document'

describe('browser tests', () => {
  it.skip('test getImageData - 需要真实浏览器环境，jsdom 无法触发 Image onload/onerror', async () => {
    const pixels = new Uint8Array([137, 80, 78, 71]) // PNG magic bytes stub
    const b = new Blob([pixels], {type: 'image/png'})
    const data = await getImageData(b)
    expect(data).toBeDefined()
  })
})

import {readFileSync} from 'node:fs'

import {describe, it} from 'vitest'

import {getImageData} from '@/browser/document'

describe('browser tests', () => {
  it('test getImageData', async () => {
    const f = readFileSync('./00.png')
    const b = new Blob([f], {type: 'image/png'})
    const data = await getImageData(b)
    const r = new Promise(resolve => {
      data.onloadeddata = () => {
        resolve(data)
      }
    })
    await r
  })
})

import {readFileSync} from 'fs-extra'
import {describe, test, expect} from 'vitest'
import u from 'pdfjs-dist/build/pdf.worker.mjs?url'

import 'core-js/es/promise/with-resolvers'
import {PdfJs} from '@/references'

describe('PdfJs', () => {
  test('test extract pdf imagess', async () => {
    console.log(u)
    PdfJs.workSrc = u.replace('/@fs/', 'file://')

    const e = readFileSync('__tests__/__test_data__/img_pdf.pdf')

    const b = new Blob([e], {type: 'application/pdf'})
    b.arrayBuffer = () => Promise.resolve(new Uint8Array(e))

    const blobs = await PdfJs.extractPdfImages(b, async d => {
      return d
    })
    expect(blobs.length).toBe(4)
  })
})

import type {PDFDocumentProxy, PDFPageProxy} from 'pdfjs-dist'
import type {dynamic, task} from '@compose/api-types'
import * as pdfjs from 'pdfjs-dist'

interface PDFImageData {
  data: number[]
  bitmap: ImageBitmap
  ref: string
  dataLen: number
  width: number
  height: number
}

export class PdfJs {
  private static __workSrc: string
  private static __worker: Worker
  private static __pdf = pdfjs

  static get instance() {
    return this.__pdf
  }

  static init() {
    if (this.workerSrc) {
      pdfjs.GlobalWorkerOptions.workerSrc = this.__workSrc
      this.__pdf.GlobalWorkerOptions.workerSrc = this.__workSrc
    }
    if (this.worker) {
      pdfjs.GlobalWorkerOptions.workerPort = this.__worker
      this.__pdf.GlobalWorkerOptions.workerPort = this.__worker
    }
    return this.__pdf
  }

  static set workerSrc(workSrc: string) {
    PdfJs.__workSrc = workSrc
    this.instance.GlobalWorkerOptions.workerSrc = workSrc
  }

  static set worker(worker: Worker) {
    this.__worker = worker
    this.instance.GlobalWorkerOptions.workerPort = worker
  }

  static get workerSrc() {
    return this.__workSrc
  }
  static get worker(): Worker {
    return this.__worker
  }

  static async resolvePages<T = dynamic>(pdf: PDFDocumentProxy, pageHandle: (page: PDFPageProxy, numPage: number) => task<T>): task<T[]> {
    const result: T[] = []
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const r = await pageHandle(page, i)
      result.push(r)
    }
    return result
  }

  static async resolveImage(arg: PDFImageData): task<string> {
    const canvas = globalThis.document.createElement('canvas')
    canvas.width = arg.width
    canvas.height = arg.height
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(arg.bitmap, 0, 0)
    return canvas.toDataURL('image/png')
  }

  static async extractPdfImages<T = string>(pdfFile: Blob, resolve?: (img: PDFImageData) => task<T>): task<T[]> {
    const pdfArrayBuffer = await pdfFile.arrayBuffer()
    const pdf = await this.instance.getDocument(pdfArrayBuffer).promise
    const e: PDFImageData[] = await this.resolvePages(pdf, async page => {
      const opList = await page.getOperatorList()
      const rawImgOperator = opList.fnArray.map((f, index) => (f === this.instance.OPS.paintImageXObject ? index : null)).filter(n => n !== null) as number[]
      const filename = opList.argsArray[rawImgOperator[0]][0]
      return page.objs.get(filename)
    })
    return await Promise.all(
      e.map(async e => {
        return (await (resolve ?? this.resolveImage)(e)) as T
      })
    )
  }
}

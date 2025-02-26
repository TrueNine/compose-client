import type { dynamic, task } from '@compose/api-types'
import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist'
import * as pdfjs from 'pdfjs-dist'

interface PDFImageData {
  data: number[]
  bitmap: ImageBitmap
  ref: string
  dataLen: number
  width: number
  height: number
}

let __workSrc: string | undefined
let __worker: Worker | undefined

export const PdfJs = pdfjs

export function init(): typeof pdfjs {
  if (__workSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc = __workSrc
    PdfJs.GlobalWorkerOptions.workerSrc = __workSrc
  }
  if (__worker) {
    pdfjs.GlobalWorkerOptions.workerPort = __worker
    PdfJs.GlobalWorkerOptions.workerPort = __worker
  }
  return PdfJs
}

export function setWorkerSrc(workSrc: string): void {
  __workSrc = workSrc
  PdfJs.GlobalWorkerOptions.workerSrc = workSrc
}

export function setWorker(worker: Worker): void {
  __worker = worker
  PdfJs.GlobalWorkerOptions.workerPort = worker
}

export function getWorkerSrc(): string | undefined {
  return __workSrc
}

export function getWorker(): Worker | undefined {
  return __worker
}

export async function resolvePages<T = dynamic>(pdf: PDFDocumentProxy, pageHandle: (page: PDFPageProxy, numPage: number) => task<T>): task<T[]> {
  const result: T[] = []
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const r = await pageHandle(page, i)
    result.push(r)
  }
  return result
}

export function resolveImage(arg: PDFImageData): string {
  const canvas = globalThis.document.createElement('canvas')
  canvas.width = arg.width
  canvas.height = arg.height
  const ctx = canvas.getContext('2d')
  ctx?.drawImage(arg.bitmap, 0, 0)
  return canvas.toDataURL('image/png')
}

export async function safeGetObject(objId: string, proxy: PDFPageProxy): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let isErr = true
    proxy.objs.get(objId, (data: unknown) => {
      isErr = false
      resolve(data)
    })
    setTimeout(() => {
      if (isErr)
        reject(new Error(`read PDF objId ${objId} mil 2000 timeout`))
    }, 2000)
  })
}

export async function extractPdfImages<T = string>(pdfFile: Blob, resolve?: (img: PDFImageData) => task<T>): task<T[]> {
  const pdfArrayBuffer = await pdfFile.arrayBuffer()
  const pdf = await PdfJs.getDocument(pdfArrayBuffer).promise
  const e: PDFImageData[] = await resolvePages(pdf, async (page) => {
    const opList = await page.getOperatorList()
    const rawImgOperator = opList.fnArray.map((f, index) => (f === PdfJs.OPS.paintImageXObject ? index : null)).filter(n => n !== null)
    const filename = opList.argsArray[rawImgOperator[0]][0]
    return (await safeGetObject(filename, page)) as PDFImageData
  })
  return await Promise.all(
    e.map(async (e) => {
      return (await (resolve ?? resolveImage)(e)) as T
    }),
  )
}

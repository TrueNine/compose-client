import type {dynamic, task} from '@truenine/types'
import type {PDFDocumentProxy, PDFPageProxy} from 'pdfjs-dist'
import * as pdfjs from 'pdfjs-dist' // FIXME 当前文件所有文件需要进行去除副作用优化

/**
 * PDF 图像数据的接口定义
 * @interface PDFImageData
 */
interface PDFImageData {
  /** 图像原始数据数组 */
  data: number[]
  /** 图像位图数据 */
  bitmap: ImageBitmap
  /** 图像引用标识符 */
  ref: string
  /** 数据长度 */
  dataLen: number
  /** 图像宽度 */
  width: number
  /** 图像高度 */
  height: number
}

/**
 * PDF 操作列表的接口定义
 * @interface PDFOperatorList
 */
interface PDFOperatorList {
  /** 操作函数数组 */
  fnArray: number[]
  /** 操作参数数组 */
  argsArray: unknown[][]
}

let __workSrc: string | undefined,
  __worker: Worker | undefined

export const PdfJs: typeof pdfjs = pdfjs

export function init(): typeof pdfjs {
  if (typeof __workSrc === 'string' && __workSrc.length > 0) {
    pdfjs.GlobalWorkerOptions.workerSrc = __workSrc
    PdfJs.GlobalWorkerOptions.workerSrc = __workSrc
  }
  if (!__worker) return PdfJs

  pdfjs.GlobalWorkerOptions.workerPort = __worker
  PdfJs.GlobalWorkerOptions.workerPort = __worker
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

/**
 * 获取当前配置的 Worker 源文件路径
 * @returns {string | undefined} Worker 源文件路径
 */
export function getWorkerSrc(): string | undefined {
  return __workSrc
}

/**
 * 获取当前配置的 Worker 实例
 * @returns {Worker | undefined} Worker 实例
 */
export function getWorker(): Worker | undefined {
  return __worker
}

export async function resolvePages<T = dynamic>(
  pdf: PDFDocumentProxy,
  pageHandle: (page: PDFPageProxy, numPage: number) => task<T>
): task<T[]> {
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

/**
 * 安全地获取 PDF 对象
 * @param {string} objId - 对象 ID
 * @param {PDFPageProxy} proxy - PDF 页面代理对象
 * @returns {Promise<unknown>} PDF 对象
 * @throws {Error} 如果获取超时（2秒）则抛出错误
 */
export async function safeGetObject(objId: string, proxy: PDFPageProxy): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let isErr = true
    proxy.objs.get(objId, (data: unknown) => {
      isErr = false
      resolve(data)
    })
    setTimeout(() => {
      if (isErr) reject(new Error(`read PDF objId ${objId} mil 2000 timeout`))
    }, 2000)
  })
}

export async function extractPdfImages<T = string>(
  pdfFile: Blob,
  resolve?: (img: PDFImageData) => task<T>
): task<T[]> {
  const pdfArrayBuffer = await pdfFile.arrayBuffer()
  const pdfDocument = await PdfJs.getDocument(pdfArrayBuffer).promise
  const extractedImages: PDFImageData[] = await resolvePages(pdfDocument, async page => {
    const operatorList = await page.getOperatorList() as PDFOperatorList
    const imageOperatorIndices = operatorList.fnArray
      .map((operator, index): number | null => (operator === PdfJs.OPS.paintImageXObject ? index : null))
      .filter((index): index is number => index !== null)

    if (imageOperatorIndices.length === 0) throw new Error('No image operators found in PDF page')

    const firstImageIndex = imageOperatorIndices[0]
    const args = operatorList.argsArray[firstImageIndex]

    if (!Array.isArray(args) || args.length === 0 || typeof args[0] !== 'string') throw new Error('Invalid image operator arguments')

    const imageRefName = args[0]
    const imageDataRaw = await safeGetObject(imageRefName, page)
    if (!isValidPDFImageData(imageDataRaw)) throw new Error('Invalid PDF image data')
    const imageData = imageDataRaw // 类型检查通过后，可以安全地进行类型断言

    return imageData
  })

  return Promise.all(
    extractedImages.map(async imageData => (await (resolve ?? resolveImage)(imageData)) as T)
  )
}

/**
 * 类型守卫：检查数据是否为有效的 PDFImageData
 * @param {unknown} data - 要检查的数据
 * @returns {boolean} 是否为有效的 PDFImageData
 */
function isValidPDFImageData(data: unknown): data is PDFImageData {
  return (
    typeof data === 'object'
    && data !== null
    && 'data' in data
    && 'bitmap' in data
    && 'ref' in data
    && 'dataLen' in data
    && 'width' in data
    && 'height' in data
  )
}

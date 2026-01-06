import type { dynamic, task } from '@truenine/types'
import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist'
import * as pdfjs from 'pdfjs-dist'

// FIXME 当前文件所有文件需要进行去除副作用优化

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

let __workSrc: string | undefined
let __worker: Worker | undefined

export const PdfJs: typeof pdfjs = pdfjs

/**
 * 初始化 PDF.js 配置
 * @returns {typeof pdfjs} 返回配置后的 PDF.js 实例
 * @example
 * ```typescript
 * const pdfjs = init();
 * // 现在可以使用配置好的 PDF.js 实例了
 * ```
 */
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

/**
 * 设置 PDF.js Worker 的源文件路径
 * @param {string} workSrc - Worker 脚本的 URL 路径
 * @example
 * ```typescript
 * setWorkerSrc('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.6.347/pdf.worker.min.js');
 * ```
 */
export function setWorkerSrc(workSrc: string): void {
  __workSrc = workSrc
  PdfJs.GlobalWorkerOptions.workerSrc = workSrc
}

/**
 * 设置 PDF.js Worker 实例
 * @param {Worker} worker - Web Worker 实例
 * @example
 * ```typescript
 * const worker = new Worker('pdf.worker.js');
 * setWorker(worker);
 * ```
 */
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

/**
 * 处理 PDF 文档的每一页
 * @template T - 页面处理结果的类型
 * @param {PDFDocumentProxy} pdf - PDF 文档代理对象
 * @param {Function} pageHandle - 处理每一页的回调函数
 * @returns {Promise<T[]>} 返回所有页面处理结果的数组
 * @example
 * ```typescript
 * const results = await resolvePages(pdfDoc, async (page, pageNum) => {
 *   const text = await page.getTextContent();
 *   return text;
 * });
 * ```
 */
export async function resolvePages<T = dynamic>(
  pdf: PDFDocumentProxy,
  pageHandle: (page: PDFPageProxy, numPage: number) => task<T>,
): task<T[]> {
  const result: T[] = []
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const r = await pageHandle(page, i)
    result.push(r)
  }
  return result
}

/**
 * 将 PDF 图像数据转换为 base64 格式的 PNG 图片
 * @param {PDFImageData} arg - PDF 图像数据
 * @returns {string} base64 格式的 PNG 图片数据
 * @example
 * ```typescript
 * const base64Image = resolveImage(pdfImageData);
 * // 可以直接在 img 标签的 src 中使用
 * ```
 */
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

/**
 * 从 PDF 文件中提取所有图片
 * @template T - 图片处理结果的类型
 * @param {Blob} pdfFile - PDF 文件数据
 * @param {Function} [resolve] - 可选的图片处理函数
 * @returns {Promise<T[]>} 处理后的图片数组
 * @example
 * ```typescript
 * // 基本用法：提取为 base64 图片
 * const images = await extractPdfImages(pdfBlob);
 *
 * // 自定义处理：转换为 URL 对象
 * const urls = await extractPdfImages(pdfBlob,
 *   async (img) => URL.createObjectURL(new Blob([img.data]))
 * );
 * ```
 */
export async function extractPdfImages<T = string>(
  pdfFile: Blob,
  resolve?: (img: PDFImageData) => task<T>,
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
    // 类型检查通过后，可以安全地进行类型断言
    const imageData = imageDataRaw

    return imageData
  })

  return Promise.all(
    extractedImages.map(async imageData => {
      return (await (resolve ?? resolveImage)(imageData)) as T
    }),
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

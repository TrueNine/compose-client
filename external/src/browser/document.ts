// 创建安全的懒加载单例下载元素
let downloadElement: HTMLAnchorElement | null = null

/**
 * 获取下载元素实例，确保只创建一次
 * 使用懒加载模式，避免在导入时就创建DOM元素
 */
function getDownloadElement(): HTMLAnchorElement {
  if (!downloadElement) {
    if (typeof document !== 'undefined') {
      downloadElement = document.createElement('a')
      downloadElement.style.display = 'none'

      document.body.appendChild(downloadElement)
    } else {
      throw new TypeError('无法创建下载元素：不在浏览器环境中')
    }
  }
  return downloadElement
}

/**
 * ## 加载外部 script 标签
 *
 * 如果存在相同 src 属性或条件相同则直接返回
 * @param src 加载地址
 * @param appendTag 加载位置
 * @param beforeEach 挂载前处理函数
 * @param loadFn 加载完成回调
 */
export function loadRemoteScriptTag(
  src: string,
  appendTag: 'head' | 'body' = 'body',
  beforeEach: (scriptTag: HTMLScriptElement) => HTMLScriptElement = b => b,
  loadFn?: () => void,
): HTMLScriptElement | null {
  // 确保在浏览器环境中执行
  if (typeof document === 'undefined') return null
  // 先查找是否已存在相同 src 的 script 标签，若存在直接返回
  const exist = document.querySelector<HTMLScriptElement>(`script[src='${src}']`)
  if (exist !== null) return exist
  // 创建 script 标签并设置属性
  const scriptTag = document.createElement('script')
  scriptTag.src = src
  scriptTag.setAttribute('charset', 'utf-8')
  if (typeof loadFn === 'function') scriptTag.addEventListener('load', loadFn)
  const parent = document.querySelector(appendTag)
  if (parent === null) return null
  parent.appendChild(beforeEach(scriptTag))
  return scriptTag
}

/**
 * ## 使用 a 标签对 Blob 进行下载
 * @param blob 文件二进制句柄
 * @param downloadName 下载的文件名称
 */
export function downloadBlob(blob: Blob, downloadName = 'noneFile'): void {
  try {
    const element = getDownloadElement()
    const url = window.URL.createObjectURL(blob)
    try {
      element.href = url
      element.download = downloadName
      element.click()
    } finally {
      window.URL.revokeObjectURL(url)
    }
  } catch (error) {
    console.error('下载文件失败:', error)
  }
}

/**
 * ## 使用 a 标签进行下载
 * @param url 下载链接
 * @param downloadName 下载的文件名称
 */
export function download(url: string, downloadName = 'noneFile'): void {
  try {
    const element = getDownloadElement()
    element.href = url
    element.download = downloadName
    element.click()
  } catch (error) {
    console.error('下载文件失败:', error)
  }
}

/**
 * ## 获取图片数据
 * @param file 图片文件Blob对象
 * @returns 包含图片元素的Promise
 */
export async function getImageData(file: Blob): Promise<HTMLImageElement> {
  const url = URL.createObjectURL(file)
  const img = new Image()

  return new Promise<HTMLImageElement>(resolve => {
    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      resolve(new Image())
    }

    img.src = url
  })
}

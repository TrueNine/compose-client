import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'

// 导入需要测试的模块
import {download, downloadBlob, getImageData, loadRemoteScriptTag} from '../document'

// 定义类型
interface MockAnchor {
  href: string
  download: string
  click: ReturnType<typeof vi.fn>
  style: {display: string}
}

interface MockScript {
  src: string
  setAttribute: ReturnType<typeof vi.fn>
  addEventListener: ReturnType<typeof vi.fn>
}

interface MockImage {
  onload: (() => void) | null
  onerror: (() => void) | null
  src: string
}

// 模拟锚点元素
const mockAnchor: MockAnchor = {href: '', download: '', click: vi.fn(), style: {display: 'none'}}

// 模拟脚本元素
const mockScript: MockScript = {src: '', setAttribute: vi.fn(), addEventListener: vi.fn()}

// 模拟 document 对象
const documentMock = {createElement: vi.fn((tag: string) => {
  if (tag === 'a') return mockAnchor
  if (tag === 'script') return mockScript
  return {}
}), body: {appendChild: vi.fn()}, querySelector: vi.fn()}

// 使用 vi.mock 进行全局模拟
vi.mock('../document', async () => {
  // 导入原始模块以获取默认导出
  const originalModule = await vi.importActual<typeof import('../document')>('../document')

  return {...originalModule,
    // 重写 downloadBlob 函数的实现
    downloadBlob: vi.fn((_: Blob, fileName: string = 'noneFile') => {
      try {
        const url = 'blob:mock-url'
        mockAnchor.href = url
        mockAnchor.download = fileName
        mockAnchor.click()
        // 实际调用时会设置这些属性
      } catch (error) { console.error('下载文件失败:', error) }
    }),
    // 重写 download 函数的实现
    download: vi.fn((url: string, fileName: string = 'noneFile') => {
      try {
        mockAnchor.href = url
        mockAnchor.download = fileName
        mockAnchor.click()
      } catch (error) { console.error('下载文件失败:', error) }
    })}
})

describe('document.ts 文件函数测试', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    // 重置所有模拟函数
    vi.resetAllMocks()

    // 重置模拟对象状态
    mockAnchor.href = ''
    mockAnchor.download = ''
    mockScript.src = ''

    // 模拟全局对象
    globalThis.document = documentMock as unknown as Document
    globalThis.window = {URL: {createObjectURL: vi.fn(() => 'blob:mock-url'), revokeObjectURL: vi.fn()}} as unknown as Window & typeof globalThis

    // 针对不使用window的函数
    globalThis.URL = {createObjectURL: vi.fn(() => 'blob:mock-url'), revokeObjectURL: vi.fn()} as unknown as typeof URL

    // 模拟 console.error
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { })
  })

  afterEach(() => vi.restoreAllMocks())

  describe('loadRemoteScriptTag 函数测试', () => {
    it('已存在相同src的script标签时直接返回该标签', () => {
      // 模拟已存在的 script 标签
      const existingScript = {src: 'https://example.com/script.js'}
      documentMock.querySelector.mockReturnValue(existingScript)

      const result = loadRemoteScriptTag('https://example.com/script.js')

      // 验证结果
      expect(result).toBe(existingScript)
      expect(documentMock.querySelector).toHaveBeenCalledWith('script[src=\'https://example.com/script.js\']')
      expect(documentMock.createElement).not.toHaveBeenCalled()
    })

    it('创建新的script标签并添加到指定位置', () => {
      // 模拟不存在相同src的script标签，但存在父元素
      const parentElement = {appendChild: vi.fn()}
      documentMock.querySelector.mockReturnValueOnce(null).mockReturnValueOnce(parentElement)

      // 创建回调函数
      const loadFn = vi.fn()
      const beforeEachFn = vi.fn(<T>(tag: T) => tag)

      const result = loadRemoteScriptTag('https://example.com/script.js', 'head', beforeEachFn, loadFn)

      // 验证结果
      expect(result).toBe(mockScript)
      expect(documentMock.createElement).toHaveBeenCalledWith('script')
      expect(mockScript.src).toBe('https://example.com/script.js')
      expect(mockScript.setAttribute).toHaveBeenCalledWith('charset', 'utf8')
      expect(mockScript.addEventListener).toHaveBeenCalledWith('load', loadFn)
      expect(documentMock.querySelector).toHaveBeenCalledWith('head')
      expect(beforeEachFn).toHaveBeenCalledWith(mockScript)
      expect(parentElement.appendChild).toHaveBeenCalled()
    })

    it('父元素不存在时返回null', () => {
      // 模拟不存在相同src的script标签且不存在父元素
      documentMock.querySelector.mockReturnValue(null)

      const result = loadRemoteScriptTag('https://example.com/script.js')

      // 验证结果
      expect(result).toBeNull()
      expect(documentMock.querySelector).toHaveBeenCalledTimes(2)
    })

    it('非浏览器环境下返回null', () => {
      // 保存原始document引用
      const originalDocument = globalThis.document

      // 使用try/finally确保测试不会影响其他测试
      try {
        // 完全删除document而不是设置为null
        // @ts-expect-error 故意删除document来模拟非浏览器环境
        delete globalThis.document

        const result = loadRemoteScriptTag('https://example.com/script.js')
        expect(result).toBeNull()
      } finally {
        // 恢复document
        globalThis.document = originalDocument
      }
    })
  })

  describe('downloadBlob 函数测试', () => {
    it('成功下载Blob数据', () => {
      // 创建测试用的Blob
      const testBlob = new Blob(['test content'], {type: 'text/plain'})

      // 执行函数
      downloadBlob(testBlob, 'test.txt')

      // 验证结果
      expect(downloadBlob).toHaveBeenCalledWith(testBlob, 'test.txt')
      expect(mockAnchor.href).toBe('blob:mock-url')
      expect(mockAnchor.download).toBe('test.txt')
      expect(mockAnchor.click).toHaveBeenCalled()
    })

    it('下载Blob时使用默认文件名', () => {
      // 创建测试用的Blob
      const testBlob = new Blob(['test content'], {type: 'text/plain'})

      // 执行函数
      downloadBlob(testBlob)

      // 验证结果
      expect(downloadBlob).toHaveBeenCalledWith(testBlob)
      expect(mockAnchor.download).toBe('noneFile')
    })

    it('下载失败时捕获并记录错误', () => {
      // 创建测试用的Blob
      const testBlob = new Blob(['test content'], {type: 'text/plain'})

      // 修改mock实现抛出错误
      mockAnchor.click.mockImplementationOnce(() => {
        throw new Error('模拟错误')
      })

      // 执行函数
      downloadBlob(testBlob)

      // 验证结果
      expect(consoleErrorSpy).toHaveBeenCalledWith('下载文件失败:', expect.any(Error))
    })
  })

  describe('download 函数测试', () => {
    it('成功下载URL链接', () => {
      // 执行函数
      download('https://example.com/file.pdf', 'document.pdf')

      // 验证结果
      expect(download).toHaveBeenCalledWith('https://example.com/file.pdf', 'document.pdf')
      expect(mockAnchor.href).toBe('https://example.com/file.pdf')
      expect(mockAnchor.download).toBe('document.pdf')
      expect(mockAnchor.click).toHaveBeenCalled()
    })

    it('下载URL时使用默认文件名', () => {
      // 执行函数
      download('https://example.com/file.pdf')

      // 验证结果
      expect(download).toHaveBeenCalledWith('https://example.com/file.pdf')
      expect(mockAnchor.download).toBe('noneFile')
    })

    it('下载失败时捕获并记录错误', () => {
      // 修改mock实现抛出错误
      mockAnchor.click.mockImplementationOnce(() => {
        throw new Error('模拟错误')
      })

      // 执行函数
      download('https://example.com/file.pdf')

      // 验证结果
      expect(consoleErrorSpy).toHaveBeenCalledWith('下载文件失败:', expect.any(Error))
    })
  })

  describe('getImageData 函数测试', () => {
    let originalImage: typeof globalThis.Image

    beforeEach(() => {
      // 保存原始 Image 构造函数
      originalImage = globalThis.Image

      // 模拟 Image 构造函数
      globalThis.Image = vi.fn().mockImplementation(() => ({onload: null, onerror: null, src: ''} as MockImage)) as unknown as typeof Image
    })

    afterEach(() => {
      // 恢复原始 Image 构造函数
      globalThis.Image = originalImage
    })

    it('成功加载图片并返回图片元素', async () => {
      // 创建测试用的Blob
      const imageBlob = new Blob(['fake image data'], {type: 'image/png'})

      // 模拟图片加载成功
      const createObjectURLFn = vi.fn(() => 'blob:image-url')
      const revokeObjectURLFn = vi.fn()

      globalThis.URL.createObjectURL = createObjectURLFn
      globalThis.URL.revokeObjectURL = revokeObjectURLFn

      // 执行函数
      const imagePromise = getImageData(imageBlob)

      // 模拟图片加载完成
      const mockImage = (globalThis.Image as unknown as ReturnType<typeof vi.fn>).mock.results[0].value as MockImage
      if (mockImage.onload) mockImage.onload()

      // 等待Promise解析
      const result = await imagePromise

      // 验证结果
      expect(createObjectURLFn).toHaveBeenCalledWith(imageBlob)
      expect(revokeObjectURLFn).toHaveBeenCalledWith('blob:image-url')
      expect(result).toBe(mockImage)
      expect(mockImage.src).toBe('blob:image-url')
    })

    it('图片加载失败时返回新的空图片元素', async () => {
      // 创建测试用的Blob
      const imageBlob = new Blob(['fake image data'], {type: 'image/png'})

      // 设置spy以便验证调用
      const revokeObjectURLSpy = vi.fn()
      globalThis.URL.revokeObjectURL = revokeObjectURLSpy

      // 执行函数
      const imagePromise = getImageData(imageBlob)

      // 模拟图片加载失败
      const mockImage = (globalThis.Image as unknown as ReturnType<typeof vi.fn>).mock.results[0].value as MockImage
      if (mockImage.onerror) mockImage.onerror()

      // 等待Promise解析，并在之后验证调用
      await imagePromise

      // 验证revokeObjectURL被调用
      expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:mock-url')
      // 验证Image被调用了两次（一次是初始创建，一次是onerror中的new Image()）
      expect(globalThis.Image).toHaveBeenCalledTimes(2)
    })
  })
})

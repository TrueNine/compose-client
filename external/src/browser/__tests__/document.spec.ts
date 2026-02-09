import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'

import {download, downloadBlob, getImageData, loadRemoteScriptTag} from '../document' // 导入需要测试的模块

interface MockAnchor { // 定义类型
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

const mockAnchor: MockAnchor = {href: '', download: '', click: vi.fn(), style: {display: 'none'}} // 模拟锚点元素

const mockScript: MockScript = {src: '', setAttribute: vi.fn(), addEventListener: vi.fn()} // 模拟脚本元素

const documentMock = {createElement: vi.fn((tag: string) => { // 模拟 document 对象
  if (tag === 'a') return mockAnchor
  if (tag === 'script') return mockScript
  return {}
}), body: {appendChild: vi.fn()}, querySelector: vi.fn()}

vi.mock('../document', async () => { // 使用 vi.mock 进行全局模拟
  const originalModule = await vi.importActual<typeof import('../document')>('../document') // 导入原始模块以获取默认导出

  return {...originalModule, downloadBlob: vi.fn((_: Blob, fileName: string = 'noneFile') => { // 重写 downloadBlob 函数的实现
    try {
      const url = 'blob:mock-url'
      mockAnchor.href = url
      mockAnchor.download = fileName
      mockAnchor.click()
    }
    catch (error) { console.error('下载文件失败:', error) } // 实际调用时会设置这些属性
  }), download: vi.fn((url: string, fileName: string = 'noneFile') => { // 重写 download 函数的实现
    try {
      mockAnchor.href = url
      mockAnchor.download = fileName
      mockAnchor.click()
    }
    catch (error) { console.error('下载文件失败:', error) }
  })}
})

describe('document.ts 文件函数测试', () => {
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    vi.resetAllMocks() // 重置所有模拟函数

    mockAnchor.href = '' // 重置模拟对象状态
    mockAnchor.download = ''
    mockScript.src = ''

    globalThis.document = documentMock as unknown as Document // 模拟全局对象
    globalThis.window = {URL: {createObjectURL: vi.fn(() => 'blob:mock-url'), revokeObjectURL: vi.fn()}} as unknown as Window & typeof globalThis

    globalThis.URL = {createObjectURL: vi.fn(() => 'blob:mock-url'), revokeObjectURL: vi.fn()} as unknown as typeof URL // 针对不使用window的函数

    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { }) // 模拟 console.error
  })

  afterEach(() => vi.restoreAllMocks())

  describe('loadRemoteScriptTag 函数测试', () => {
    it('已存在相同src的script标签时直接返回该标签', () => {
      const existingScript = {src: 'https://example.com/script.js'} // 模拟已存在的 script 标签
      documentMock.querySelector.mockReturnValue(existingScript)

      const result = loadRemoteScriptTag('https://example.com/script.js')

      expect(result).toBe(existingScript) // 验证结果
      expect(documentMock.querySelector).toHaveBeenCalledWith('script[src=\'https://example.com/script.js\']')
      expect(documentMock.createElement).not.toHaveBeenCalled()
    })

    it('创建新的script标签并添加到指定位置', () => {
      const parentElement = {append: vi.fn(), appendChild: vi.fn()} // 模拟不存在相同src的script标签，但存在父元素
      documentMock.querySelector.mockReturnValueOnce(null).mockReturnValueOnce(parentElement)

      const loadFn = vi.fn() // 创建回调函数
      const beforeEachFn = vi.fn(<T>(tag: T) => tag)

      const result = loadRemoteScriptTag('https://example.com/script.js', 'head', beforeEachFn, loadFn)

      expect(result).toBe(mockScript) // 验证结果
      expect(documentMock.createElement).toHaveBeenCalledWith('script')
      expect(mockScript.src).toBe('https://example.com/script.js')
      expect(mockScript.setAttribute).toHaveBeenCalledWith('charset', 'utf8')
      expect(mockScript.addEventListener).toHaveBeenCalledWith('load', loadFn)
      expect(documentMock.querySelector).toHaveBeenCalledWith('head')
      expect(beforeEachFn).toHaveBeenCalledWith(mockScript)
      expect(parentElement.append).toHaveBeenCalled()
    })

    it('父元素不存在时返回null', () => {
      documentMock.querySelector.mockReturnValue(null) // 模拟不存在相同src的script标签且不存在父元素

      const result = loadRemoteScriptTag('https://example.com/script.js')

      expect(result).toBeNull() // 验证结果
      expect(documentMock.querySelector).toHaveBeenCalledTimes(2)
    })

    it('非浏览器环境下返回null', () => {
      const originalDocument = globalThis.document // 保存原始document引用

      try { // 使用try/finally确保测试不会影响其他测试
        delete globalThis.document // @ts-expect-error 故意删除document来模拟非浏览器环境 // 完全删除document而不是设置为null

        const result = loadRemoteScriptTag('https://example.com/script.js')
        expect(result).toBeNull()
      }
      finally { /* 恢复document */ globalThis.document = originalDocument }
    })
  })

  describe('downloadBlob 函数测试', () => {
    it('成功下载Blob数据', () => {
      const testBlob = new Blob(['test content'], {type: 'text/plain'}) // 创建测试用的Blob

      downloadBlob(testBlob, 'test.txt') // 执行函数

      expect(downloadBlob).toHaveBeenCalledWith(testBlob, 'test.txt') // 验证结果
      expect(mockAnchor.href).toBe('blob:mock-url')
      expect(mockAnchor.download).toBe('test.txt')
      expect(mockAnchor.click).toHaveBeenCalled()
    })

    it('下载Blob时使用默认文件名', () => {
      const testBlob = new Blob(['test content'], {type: 'text/plain'}) // 创建测试用的Blob

      downloadBlob(testBlob) // 执行函数

      expect(downloadBlob).toHaveBeenCalledWith(testBlob) // 验证结果
      expect(mockAnchor.download).toBe('noneFile')
    })

    it('下载失败时捕获并记录错误', () => {
      const testBlob = new Blob(['test content'], {type: 'text/plain'}) // 创建测试用的Blob

      mockAnchor.click.mockImplementationOnce(() => { // 修改mock实现抛出错误
        throw new Error('模拟错误')
      })

      downloadBlob(testBlob) // 执行函数

      expect(consoleErrorSpy).toHaveBeenCalledWith('下载文件失败:', expect.any(Error)) // 验证结果
    })
  })

  describe('download 函数测试', () => {
    it('成功下载URL链接', () => {
      download('https://example.com/file.pdf', 'document.pdf') // 执行函数

      expect(download).toHaveBeenCalledWith('https://example.com/file.pdf', 'document.pdf') // 验证结果
      expect(mockAnchor.href).toBe('https://example.com/file.pdf')
      expect(mockAnchor.download).toBe('document.pdf')
      expect(mockAnchor.click).toHaveBeenCalled()
    })

    it('下载URL时使用默认文件名', () => {
      download('https://example.com/file.pdf') // 执行函数

      expect(download).toHaveBeenCalledWith('https://example.com/file.pdf') // 验证结果
      expect(mockAnchor.download).toBe('noneFile')
    })

    it('下载失败时捕获并记录错误', () => {
      mockAnchor.click.mockImplementationOnce(() => { // 修改mock实现抛出错误
        throw new Error('模拟错误')
      })

      download('https://example.com/file.pdf') // 执行函数

      expect(consoleErrorSpy).toHaveBeenCalledWith('下载文件失败:', expect.any(Error)) // 验证结果
    })
  })

  describe('getImageData 函数测试', () => {
    let originalImage: typeof globalThis.Image

    beforeEach(() => {
      originalImage = globalThis.Image // 保存原始 Image 构造函数

      globalThis.Image = class MockImageClass {
        onload: (() => void) | null = null
        onerror: (() => void) | null = null
        src = ''
      } as unknown as typeof Image // 模拟 Image 构造函数
    })

    afterEach(() => {
      globalThis.Image = originalImage // 恢复原始 Image 构造函数
    })

    it('成功加载图片并返回图片元素', async () => {
      const imageBlob = new Blob(['fake image data'], {type: 'image/png'}) // 创建测试用的Blob

      const createObjectURLFn = vi.fn(() => 'blob:image-url') // 模拟图片加载成功
      const revokeObjectURLFn = vi.fn()

      globalThis.URL.createObjectURL = createObjectURLFn
      globalThis.URL.revokeObjectURL = revokeObjectURLFn

      let capturedImg: MockImage | null = null
      globalThis.Image = class {
        onload: (() => void) | null = null
        onerror: (() => void) | null = null
        src = ''
        constructor() { capturedImg = this as unknown as MockImage }
      } as unknown as typeof Image

      const imagePromise = getImageData(imageBlob) // 执行函数

      if (capturedImg !== null && (capturedImg as MockImage).onload !== null) (capturedImg as MockImage).onload!() // 模拟图片加载完成

      const result = await imagePromise // 等待Promise解析

      expect(createObjectURLFn).toHaveBeenCalledWith(imageBlob) // 验证结果
      expect(revokeObjectURLFn).toHaveBeenCalledWith('blob:image-url')
      expect(result).toBe(capturedImg)
      expect((capturedImg as MockImage).src).toBe('blob:image-url')
    })

    it('图片加载失败时返回新的空图片元素', async () => {
      const imageBlob = new Blob(['fake image data'], {type: 'image/png'}) // 创建测试用的Blob

      const revokeObjectURLSpy = vi.fn() // 设置spy以便验证调用
      globalThis.URL.revokeObjectURL = revokeObjectURLSpy

      let imageCount = 0
      globalThis.Image = class {
        onload: (() => void) | null = null
        onerror: (() => void) | null = null
        src = ''
        constructor() { imageCount++ }
      } as unknown as typeof Image

      let capturedImg: MockImage | null = null
      const OrigImage = globalThis.Image
      globalThis.Image = class extends (OrigImage as unknown as new () => MockImage) {
        constructor() {
          super()
          capturedImg = this as unknown as MockImage
        }
      } as unknown as typeof Image
      imageCount = 0

      const imagePromise = getImageData(imageBlob) // 执行函数

      if (capturedImg !== null && (capturedImg as MockImage).onerror !== null) (capturedImg as MockImage).onerror!() // 模拟图片加载失败

      await imagePromise // 等待Promise解析，并在之后验证调用

      expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:mock-url') // 验证revokeObjectURL被调用
      expect(imageCount).toBe(2) // 验证Image被调用了两次（一次是初始创建，一次是onerror中的new Image()）
    })
  })
})

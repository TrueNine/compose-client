/**
 * 一系列的 Dom 操作函数
 */
export class Dom {
  /**
   * ## 加载外部 script 标签
   *
   * 如果存在相同 src 属性或条件相同则直接返回
   * @param src 加载地址
   * @param appendTag 加载位置
   * @param beforeEach 挂载前处理函数
   */
  public static loadRemoteScriptTag(
    src: string,
    appendTag: 'head' | 'body' = 'body',
    beforeEach: (scriptTag: HTMLScriptElement) => HTMLScriptElement = b => b
  ) {
    const a = document.querySelector(`script[src='${src}']`) as HTMLScriptElement | null
    if (null !== a) return a
    const scriptTag = document.createElement('script')
    scriptTag.src = src
    scriptTag.setAttribute('charset', 'utf-8')
    document.querySelector(appendTag)?.appendChild(beforeEach(scriptTag))
    return scriptTag
  }

  /**
   * ## 使用 a 标签对 Blob 进行下载
   * @param blob 文件二进制句柄
   * @param downloadName 下载的文件名称
   */
  public static downloadBlob(blob: Blob, downloadName = 'noneFile') {
    const a = document.createElement('a')
    a.href = window.URL.createObjectURL(blob)
    a.download = downloadName
    document.body.appendChild(a).click()
    window.URL.revokeObjectURL(a.href)
    document.body.removeChild(a)
  }
}
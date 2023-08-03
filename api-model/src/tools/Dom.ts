export {}

export class Dom {
  /**
   * ## 加载函数
   */
  static loadRemoteScriptTag(src: string, appendTag: 'head' | 'body' = 'body') {
    const scriptTag = document.createElement('script')
    scriptTag.src = src
    scriptTag.setAttribute('charset', 'utf-8')
    document.querySelector(appendTag)?.appendChild(scriptTag)
  }
}

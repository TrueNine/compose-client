import StompJS, {type Frame} from 'stompjs'
import type {HttpUrl} from '@compose/api-model'

/**
 * # StompJS 库的简单封装
 * @author TrueNine
 * @since 2021-09-01
 */
export class StompClient {
  private constructor() {
    /* */
  }

  /**
   * ## 检查 Stomp 的环境是否已经就绪
   */
  public static isReady(): boolean {
    return !(window.global == null)
  }

  /**
   * ## 初始化 stompJS 需要的 全局 global 变量
   */
  public static initGlobal() {
    if (!window.global) (window.global as unknown) = window
  }

  /**
   * ## 获取 stomp 客户端
   * @param url url
   */
  public static async getClient(url: HttpUrl): Promise<StompJS.Client> {
    if (!this.isReady()) this.initGlobal()
    const sockjs = await import('sockjs-client')
    const sock = new sockjs.default(url)
    return StompJS.over(sock)
  }

  /**
   * ## 获得 stomp 客户端后，并开启连续
   * @param url 链接
   * @param connectCallback 连接后的回调
   * @param headers 携带的请求头
   * @param errorCallback 错误回调
   */
  public static async connectTo(
    url: HttpUrl,
    connectCallback: (stompClient: StompJS.Client, frame?: Frame) => unknown,
    headers: Record<string, string> = {},
    errorCallback?: (error: Frame | string) => unknown
  ) {
    const client = await this.getClient(url)
    client.connect(
      headers,
      f => {
        return connectCallback(client, f)
      },
      errorCallback
    )
  }
}

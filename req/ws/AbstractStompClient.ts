export abstract class AbstractStompClient {
  /**
   * ## 检查 Stomp 的环境是否已经就绪
   */
  public static isReady(): boolean {
    return !(globalThis.global == null)
  }

  /**
   * ## 初始化 stompJS 需要的 全局 global 变量
   */
  public static initGlobal() {
    if (this.isReady()) globalThis.global = globalThis
  }
}

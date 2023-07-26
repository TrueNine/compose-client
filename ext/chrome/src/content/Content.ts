import type {ChannelTypedMessage} from '..'

export {}

/**
 * # 内容页面消息调用器
 */
export class ContentMessageSender {
  /**
   * ## 向插件管道发送消息
   *
   * @param msg 消息体
   * @returns 返回消息
   */
  public static async send<T, R>(msg: ChannelTypedMessage<T>): Promise<R | null> {
    const result = await chrome.runtime.sendMessage(msg)
    return result ? result : null
  }
}

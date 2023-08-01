import type {ChannelTypedMessage} from '@/typ'
import type {Asyncable, Nullable} from '@compose/api-model'
export {}

/**
 * # 消息管道推送器
 *
 * @author TrueNine
 * @since 2023-07-26
 */
export class MessageSender {
  /**
   * ## 查询当前浏览器打开的页面 tab
   *
   * - 限制在 popup
   * @returns 浏览器当前打开的窗口页面
   */
  public static async getCurrentTab(): Promise<chrome.tabs.Tab | undefined> {
    return chrome.tabs
      .query({
        active: true,
        currentWindow: true
      })
      .then(r => r[0])
  }

  /**
   * ## 将消息发送到当前打开的浏览器页面
   * @param msg 带id 的消息
   */
  public static async sendToActivatedTab<T, R = unknown>(msg: ChannelTypedMessage<T>): Promise<Nullable<ChannelTypedMessage<R>>> {
    const current = await MessageSender.getCurrentTab()
    if (current) return (await chrome.tabs.sendMessage(current.id!, msg)) ?? null
    else return null
  }

  public static async sendToRuntimeChannel<T = unknown, R = unknown>(msg: ChannelTypedMessage<T>): Promise<R> {
    return await chrome.runtime.sendMessage(msg)
  }

  /**
   * ## 监听从消息管道发送的特定消息id的消息体
   * @param msgId 指定的消息id
   * @param receiver 接受函数
   */
  public static async addRuntimeMessageLIstener<T = unknown>(msgId: string, receiver: (msg: ChannelTypedMessage<T>) => Asyncable<void>) {
    chrome.runtime.onMessage.addListener(msg => {
      if (msg && msg.msgId && msg.msgId === msgId) receiver(msg)
    })
  }
}

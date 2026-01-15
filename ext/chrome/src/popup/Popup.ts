import type {asyncable, task} from '@truenine/types'

import type {ChannelTypedMessage} from '../typ'

/**
 * 类型守卫：检查消息是否符合 ChannelTypedMessage 接口
 */
function isChannelTypedMessage<T>(message: unknown): message is ChannelTypedMessage<T> {
  return (
    message !== null
    && typeof message === 'object'
    && 'msgId' in message
    && typeof (message as ChannelTypedMessage<T>).msgId === 'string'
  )
}

/**
 * # 消息管道推送器
 *
 * @author TrueNine
 * @since 2023-07-26
 */
export class MessageSender {
  public static async sendToRuntimeChannel<T = unknown, R = unknown>(
    msg: ChannelTypedMessage<T>,
  ): task<R> {
    if (typeof chrome === 'undefined' || typeof chrome.runtime === 'undefined') throw new TypeError('Chrome runtime API is not available') // 检查 Chrome API 是否可用

    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(msg, (response: R) => {
        if (chrome.runtime.lastError) { // 检查是否有运行时错误
          reject(new Error(chrome.runtime.lastError.message))
          return
        }
        resolve(response)
      })
    })
  }

  /**
   * ## 监听从消息管道发送的特定消息id的消息体
   * @param msgId 指定的消息id
   * @param receiver 接受函数
   */
  public static addRuntimeMessageLIstener<T = unknown>(
    msgId: string,
    receiver: (msg: ChannelTypedMessage<T>) => asyncable<void>,
  ): void {
    if (typeof chrome === 'undefined' || typeof chrome.runtime === 'undefined') { // 检查 Chrome API 是否可用
      console.error('Chrome runtime API is not available')
      return
    }

    chrome.runtime.onMessage.addListener((message: unknown) => {
      if (isChannelTypedMessage<T>(message) && message.msgId === msgId) void receiver(message)
    })
  }
}

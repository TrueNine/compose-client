export {}

/**
 * # 传递的消息类型
 */
export interface ChannelTypedMessage<T = unknown> {
  msgId: string
  payload?: T
}

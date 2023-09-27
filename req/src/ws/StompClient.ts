import type {HttpUrl, WebSocketUrl} from '@compose/compose-types'
import {Client} from '@stomp/stompjs'

import {AbstractStompClient} from './AbstractStompClient'

export class StompClient extends AbstractStompClient {
  private constructor() {
    super()
  }

  /**
   * ## 获取 stomp 客户端
   * @param url url
   */
  public static async getClient(url: HttpUrl | WebSocketUrl): Promise<Client> {
    if (!this.isReady()) this.initGlobal()
    const sockJs = new (await import('sockjs-client')).default(url)
    return new Client({
      webSocketFactory: () => sockJs,
      connectionTimeout: 3000
    })
  }
}

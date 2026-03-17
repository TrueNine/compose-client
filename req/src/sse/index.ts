import type {dynamic, HttpUrl} from '@truenine/types'

export class SseReceiver {
  private readonly _e: EventSource
  private readonly _url: HttpUrl
  private readonly _init?: EventSourceInit

  constructor(url: HttpUrl, init?: EventSourceInit) {
    this._url = url
    this._init = init
    this._e = new EventSource(url, init)
  }

  get initParam(): EventSourceInit | undefined {
    return this._init
  }

  get url(): HttpUrl {
    return this._url
  }

  get handle(): EventSource {
    return this._e
  }

  onOpen(c: (this: EventSource, ev: Event) => dynamic): void {
    this.handle.onopen = c
  }

  onMessage<T = dynamic>(c: (this: EventSource, ev: MessageEvent<T>) => dynamic): void {
    this.handle.onmessage = c
  }

  onError(a: (this: EventSource, event: Event) => dynamic): void {
    this.handle.onerror = a
  }
}

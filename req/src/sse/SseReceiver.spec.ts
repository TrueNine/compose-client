import {describe, expect, it, vi} from 'vitest'
import {SseReceiver} from './index'

class MockEventSource {
  url = ''
  init: EventSourceInit | undefined
  onopen: ((this: EventSource, ev: Event) => unknown) | null = null
  onmessage: ((this: EventSource, ev: MessageEvent) => unknown) | null = null
  onerror: ((this: EventSource, event: Event) => unknown) | null = null

  constructor(url: string, init?: EventSourceInit) {
    this.url = url
    this.init = init
  }
}

describe('sseReceiver', () => {
  it('should store url and init', () => {
    const original = globalThis.EventSource
    globalThis.EventSource = MockEventSource as unknown as typeof EventSource

    const receiver = new SseReceiver('https://example.com/sse', {withCredentials: true})
    expect(receiver.url).toBe('https://example.com/sse')
    expect(receiver.initParam).toEqual({withCredentials: true})

    globalThis.EventSource = original
  })

  it('should assign open handler', () => {
    const original = globalThis.EventSource
    globalThis.EventSource = MockEventSource as unknown as typeof EventSource

    const receiver = new SseReceiver('https://example.com/sse')
    const handler = vi.fn()
    receiver.onOpen(handler)
    expect(receiver.handle.onopen).toBe(handler)

    globalThis.EventSource = original
  })

  it('should assign message handler', () => {
    const original = globalThis.EventSource
    globalThis.EventSource = MockEventSource as unknown as typeof EventSource

    const receiver = new SseReceiver('https://example.com/sse')
    const handler = vi.fn()
    receiver.onMessage(handler)
    expect(receiver.handle.onmessage).toBe(handler)

    globalThis.EventSource = original
  })

  it('should assign error handler', () => {
    const original = globalThis.EventSource
    globalThis.EventSource = MockEventSource as unknown as typeof EventSource

    const receiver = new SseReceiver('https://example.com/sse')
    const handler = vi.fn()
    receiver.onError(handler)
    expect(receiver.handle.onerror).toBe(handler)

    globalThis.EventSource = original
  })
})

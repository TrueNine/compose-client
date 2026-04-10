import {afterEach, describe, expect, it, vi} from 'vitest'
import {MessageSender} from './Popup'

describe('MessageSender', () => {
  afterEach(() => {
    delete (globalThis as {chrome?: typeof chrome}).chrome
  })

  function mockChromeRuntime() {
    const sendMessage = vi.fn()
    const addListener = vi.fn()
    const runtime = {
      sendMessage,
      onMessage: {addListener},
      lastError: undefined as {message: string} | undefined
    }
    globalThis.chrome = {runtime} as unknown as typeof chrome
    return {sendMessage, addListener, runtime}
  }

  describe('sendToRuntimeChannel', () => {
    it('should reject when chrome runtime is unavailable', async () => {
      await expect(MessageSender.sendToRuntimeChannel({msgId: 'test'})).rejects.toThrow('Chrome runtime API is not available')
    })

    it('should resolve with response on success', async () => {
      const {sendMessage} = mockChromeRuntime()
      sendMessage.mockImplementation((_msg, callback: (r: unknown) => void) => {
        callback({ok: true})
      })
      const result = await MessageSender.sendToRuntimeChannel({msgId: 'test', payload: 1})
      expect(result).toEqual({ok: true})
    })

    it('should reject when lastError exists', async () => {
      const {sendMessage, runtime} = mockChromeRuntime()
      runtime.lastError = {message: 'failed'}
      sendMessage.mockImplementation((_msg, callback: (r: unknown) => void) => {
        callback(null)
      })
      await expect(MessageSender.sendToRuntimeChannel({msgId: 'test'})).rejects.toThrow('failed')
    })
  })

  describe('addRuntimeMessageLIstener', () => {
    it('should log error when chrome runtime is unavailable', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
      MessageSender.addRuntimeMessageLIstener('test', () => {})
      expect(consoleError).toHaveBeenCalledWith('Chrome runtime API is not available')
      consoleError.mockRestore()
    })

    it('should add listener and filter by msgId', () => {
      const {addListener} = mockChromeRuntime()
      const receiver = vi.fn()
      MessageSender.addRuntimeMessageLIstener('myId', receiver)
      expect(addListener).toHaveBeenCalledOnce()
      const handler = addListener.mock.calls[0]![0] as (msg: unknown) => void
      handler({msgId: 'other'})
      expect(receiver).not.toHaveBeenCalled()
      handler({msgId: 'myId', payload: 42})
      expect(receiver).toHaveBeenCalledWith({msgId: 'myId', payload: 42})
    })

    it('should ignore non-object messages', () => {
      const {addListener} = mockChromeRuntime()
      const receiver = vi.fn()
      MessageSender.addRuntimeMessageLIstener('myId', receiver)
      const handler = addListener.mock.calls[0]![0] as (msg: unknown) => void
      handler(null)
      handler('string')
      handler(123)
      expect(receiver).not.toHaveBeenCalled()
    })
  })
})

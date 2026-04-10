import {beforeEach, describe, expect, it, vi} from 'vitest'

vi.mock('@truenine/external/browser/document', () => ({
  loadRemoteScriptTag: vi.fn()
}))

vi.mock('@/common/JsApiList', () => ({
  AllJsApiList: ['mockApi']
}))

import {loadRemoteScriptTag} from '@truenine/external/browser/document'
import {loadWxpaJsSdk, WXPA_SCRIPT_URL} from './ScriptLoad'

describe('ScriptLoad', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    delete (globalThis as {wx?: unknown}).wx
  })

  it('should define WXPA_SCRIPT_URL', () => {
    expect(WXPA_SCRIPT_URL).toBe('https://res.wx.qq.com/open/js/jweixin-1.6.0.js')
  })

  it('should return script element and configure wx when ready', () => {
    const fakeScript = document.createElement('script')
    const configFn = vi.fn()
    const readyFn = vi.fn()
    globalThis.wx = {config: configFn, ready: readyFn} as unknown as typeof wx
    vi.mocked(loadRemoteScriptTag).mockImplementation((_src, _tag, _before, loadFn) => {
      if (typeof loadFn === 'function') loadFn()
      return fakeScript
    })
    const options = {appId: 'test', timestamp: 1234567890, nonceStr: 'nonce', signature: 'sig'}
    const result = loadWxpaJsSdk(void 0, options)
    expect(result).toBe(fakeScript)
    expect(loadRemoteScriptTag).toHaveBeenCalledWith(WXPA_SCRIPT_URL, 'head', void 0, expect.any(Function))
    expect(configFn).toHaveBeenCalledWith({...options, jsApiList: ['mockApi']})
    expect(readyFn).toHaveBeenCalledOnce()
  })

  it('should call lazy callback inside ready', () => {
    const fakeScript = document.createElement('script')
    vi.mocked(loadRemoteScriptTag).mockImplementation((_src, _tag, _before, loadFn) => {
      if (typeof loadFn === 'function') loadFn()
      return fakeScript
    })
    globalThis.wx = {config: vi.fn(), ready: vi.fn(cb => cb())} as unknown as typeof wx
    const lazy = vi.fn()
    loadWxpaJsSdk(lazy, {appId: 'test', timestamp: 1, nonceStr: 'n', signature: 's'})
    expect(lazy).toHaveBeenCalledOnce()
  })

  it('should work without configOptions', () => {
    const fakeScript = document.createElement('script')
    vi.mocked(loadRemoteScriptTag).mockReturnValue(fakeScript)
    globalThis.wx = {config: vi.fn(), ready: vi.fn()} as unknown as typeof wx
    const result = loadWxpaJsSdk(void 0, void 0)
    expect(result).toBe(fakeScript)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((globalThis as any).wx.config).not.toHaveBeenCalled()
  })
})

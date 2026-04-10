import {beforeEach, describe, expect, it, vi} from 'vitest'
import {initTencentMapWebGlScript} from './TMapCommon'

vi.mock('@truenine/external/browser/document', () => ({
  loadRemoteScriptTag: vi.fn()
}))

import {loadRemoteScriptTag} from '@truenine/external/browser/document'

describe('initTencentMapWebGlScript', () => {
  beforeEach(() => {
    vi.resetAllMocks()
    document.body.innerHTML = ''
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (window as any).TMap
  })

  it('should return null when loadQuery is not a string', () => {
    const result = initTencentMapWebGlScript('key', void 0, {loadQuery: 123 as unknown as string})
    expect(result).toBeNull()
  })

  it('should return null when loadQuery is empty after trim', () => {
    const result = initTencentMapWebGlScript('key', void 0, {loadQuery: '   '})
    expect(result).toBeNull()
  })

  it('should return null when containerTag is falsy', () => {
    document.body.innerHTML = '<section id="tencent_map_basic_sdk_container_id"></section>'
    const result = initTencentMapWebGlScript('key', void 0, {
      loadQuery: '#tencent_map_basic_sdk_container_id',
      containerTag: '' as unknown as keyof HTMLElementTagNameMap
    })
    expect(result).toBeNull()
  })

  it('should return null when mapContainerId is empty after trim', () => {
    document.body.innerHTML = '<section id="tencent_map_basic_sdk_container_id"></section>'
    const result = initTencentMapWebGlScript('key', void 0, {
      loadQuery: '#tencent_map_basic_sdk_container_id',
      containerTag: 'div',
      mapContainerId: ''
    })
    expect(result).toBeNull()
  })

  it('should return null when section not found', () => {
    const result = initTencentMapWebGlScript('key', void 0, {
      loadQuery: '#missing',
      containerTag: 'div',
      mapContainerId: 'map'
    })
    expect(result).toBeNull()
  })

  it('should create script and container when section exists without callback', () => {
    document.body.innerHTML = '<section id="tencent_map_basic_sdk_container_id"></section>'
    const fakeScript = document.createElement('script')
    vi.mocked(loadRemoteScriptTag).mockReturnValue(fakeScript)
    const result = initTencentMapWebGlScript('mykey', void 0, {
      loadQuery: '#tencent_map_basic_sdk_container_id',
      containerTag: 'div',
      mapContainerId: 'tmap-container'
    })
    expect(result).not.toBeNull()
    expect(result!.src).toBe(fakeScript)
    expect(document.getElementById('tmap-container')).not.toBeNull()
    expect(loadRemoteScriptTag).toHaveBeenCalledOnce()
    const calledUrl = vi.mocked(loadRemoteScriptTag).mock.calls[0]![0] as string
    expect(calledUrl.startsWith('https://map.qq.com/api/gljs')).toBe(true)
    expect(calledUrl.includes('key=mykey')).toBe(true)
  })

  it('should invoke callback immediately and on load when callback provided', () => {
    document.body.innerHTML = '<section id="tencent_map_basic_sdk_container_id"></section>'
    const fakeScript = document.createElement('script')
    const addEventListener = vi.fn()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(fakeScript as any).addEventListener = addEventListener
    vi.mocked(loadRemoteScriptTag).mockReturnValue(fakeScript)
    const cb = vi.fn()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ;(window as any).TMap = {service: {}}
    initTencentMapWebGlScript('mykey', cb, {
      loadQuery: '#tencent_map_basic_sdk_container_id',
      containerTag: 'div',
      mapContainerId: 'tmap-container'
    })
    expect(cb).toHaveBeenCalledOnce()
    const [container, tMap] = cb.mock.calls[0] as [HTMLElement, unknown]
    expect(container.id).toBe('tmap-container')
    expect(tMap).toBe((window as {TMap?: unknown}).TMap)
    expect(addEventListener).toHaveBeenCalledWith('load', expect.any(Function))
    const loadHandler = addEventListener.mock.calls[0]![1] as (ev: Event) => void
    const ev = new Event('load')
    loadHandler(ev)
    expect(cb).toHaveBeenCalledTimes(2)
  })
})

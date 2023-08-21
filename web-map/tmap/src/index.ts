import {TMap} from 'compose-tmap'
import {Dom, queryParam, type WGS84} from '@compose/api-model'

export const WEBGL_JS_URL = 'https://map.qq.com/api/gljs'

/**
 * ## 腾讯地图初始化参数
 */
export interface CreateTencentMapOptions {
  loadQuery?: string
  isAsync?: boolean
  containerTag?: keyof HTMLElementTagNameMap
  mapContainerId?: string
  asyncFunName?: string
}

const _default = {
  loadQuery: '#tencent_map_basic_sdk_container_id',
  isAsync: false,
  asyncFunName: 'initTencentFromAsync',
  containerTag: 'section' as keyof HTMLElementTagNameMap,
  mapContainerId: 'tencent-tmap-webgl'
}

/**
 * ## 初始化腾讯地图
 * @param key sdk key
 * @param callback 加载脚本后的回调函数
 * @param options 加载选项
 */
export function initTencentMapWebGlScript(
  key: string,
  callback: (container: HTMLElement, mapHandle: typeof TMap, ev?: Event) => void,
  options: CreateTencentMapOptions = _default
) {
  const section = document.querySelector(options.loadQuery!)
  const src = Dom.loadRemoteScriptTag(
    `${WEBGL_JS_URL}${queryParam({
      v: 1,
      key
    })}`
  )
  // 创建一个id容器
  const mapContainer: HTMLElement = document.createElement(options.containerTag!)
  mapContainer.id = options.mapContainerId!
  section?.appendChild(mapContainer)
  if (callback)
    src.addEventListener('load', (ev: Event) => {
      const handle = window.TMap as typeof TMap
      callback(mapContainer, handle, ev)
    })
  return {src, mapContainer}
}

export function toWgs84(latLng: TMap.LatLng): WGS84 {
  return latLng as WGS84
}

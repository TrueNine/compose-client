import {Dom, queryParam} from '@compose/api-model'

import {WEBGL_JS_URL} from '../Constants'
import type {TMap} from '../index'

/**
 * [附加库加载类型](https://lbs.qq.com/webApi/javascriptGL/glGuide/glBasic#3)
 */
export type TencentLibraries = 'visualization' | 'tools' | 'geometry' | 'model' | 'view' | 'service'

/**
 * ## 腾讯地图初始化参数
 */
export interface CreateTencentMapOptions {
  loadQuery?: string
  isAsync?: boolean
  containerTag?: keyof HTMLElementTagNameMap
  mapContainerId?: string
  asyncFunName?: string
  libraries?: TencentLibraries[]
}

const _default = {
  loadQuery: '#tencent_map_basic_sdk_container_id',
  isAsync: false,
  asyncFunName: 'initTencentFromAsync',
  containerTag: 'map' as keyof HTMLElementTagNameMap,
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
      v: '1.exp',
      key,
      libraries: options.libraries
    })}`
  )
  // 创建一个id容器
  const mapContainer: HTMLElement = document.createElement(options.containerTag!)
  mapContainer.id = options.mapContainerId!
  section?.appendChild(mapContainer)
  if (callback) {
    const tMap = window.TMap as typeof TMap
    if (tMap) {
      callback(mapContainer, tMap)
    } else {
      src.addEventListener('load', (ev: Event) => {
        const handle = window.TMap as typeof TMap
        callback(mapContainer, handle, ev)
      })
    }
  }

  return {src, mapContainer}
}

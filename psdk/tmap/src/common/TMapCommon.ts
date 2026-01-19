import type {TMapSDK} from '../types'
import {loadRemoteScriptTag} from '@truenine/external/browser/document'
import {queryParam} from '@truenine/req'
import {WEBGL_JS_URL} from '@/Constants'

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
  containerTag: 'map',
  mapContainerId: 'tencent-tmap-webgl'
} satisfies CreateTencentMapOptions

interface InitResult {
  src: HTMLScriptElement
  mapContainer: HTMLElement
}

/**
 * ## 初始化腾讯地图
 * @param key sdk key
 * @param callback 加载脚本后的回调函数
 * @param options 加载选项
 * @returns 初始化结果，包含脚本元素和地图容器
 */
export function initTencentMapWebGlScript(
  key: string,
  callback?: (container: HTMLElement, mapHandle: TMapSDK, ev?: Event) => void,
  options: CreateTencentMapOptions = _default
): InitResult | null {
  if (typeof options.loadQuery !== 'string') return null // 验证必要参数
  const query = options.loadQuery.trim()
  if (!query) return null

  const {containerTag} = options
  if (!containerTag) return null

  if (typeof options.mapContainerId !== 'string') return null
  const containerId = options.mapContainerId.trim()
  if (!containerId) return null

  const section = document.querySelector(query)
  if (!section) return null

  const src = loadRemoteScriptTag(`${WEBGL_JS_URL}${queryParam({v: '1.exp', key, libraries: options.libraries})}`) as HTMLScriptElement

  const mapContainer: HTMLElement = document.createElement(containerTag) // 创建一个id容器
  mapContainer.id = containerId
  section.append(mapContainer)

  if (!callback) return {src, mapContainer}

  const tMap = window.TMap
  callback(mapContainer, tMap)
  src.addEventListener('load', (ev: Event) => {
    const handle = window.TMap
    callback(mapContainer, handle, ev)
  })
  return {src, mapContainer}
}

import {Vue} from '@compose/api-model'
import type {BasicMapZoomType, ViewMode} from '@compose/psdk-tmap'

import _c from './YMapTencent.vue'
export default Vue.componentInstallToPlugin(_c)

export interface YMapTencentProps {
  zoom?: number
  apiKey: string
  containerId?: string
  controlBtn?: boolean
  multiPoint?: boolean
  showCopyright?: boolean
  viewMode?: ViewMode
  initCenter?: TMap.LatLngDataTyping
  doubleClickZoom?: boolean
  serviceKey?: string
  styleId?: number
  mapZoomType?: BasicMapZoomType
}
export interface YMapTencentEmits {
  (e: 'update:viewMode', v: ViewMode): void
}

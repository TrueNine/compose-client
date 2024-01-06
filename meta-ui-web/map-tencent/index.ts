import {Vue} from '@compose/api-model'
import type {BasicMapZoomType, TMap} from '@compose/psdk-tmap'

import _c from './YMapTencent.vue'

export default Vue.componentInstallToPlugin(_c)

export interface YMapTencentProps {
  zoom?: number
  apiKey: string
  containerId?: string
  controlBtn?: boolean
  multiPoint?: boolean
  showCopyright?: boolean
  viewMode?: TMap.ViewMode
  initCenter?: TMap.LatLngDataTyping
  doubleClickZoom?: boolean
  serviceKey?: string
  styleId?: number
  mapZoomType?: BasicMapZoomType
}
export interface YMapTencentEmits {
  (e: 'update:viewMode', v: TMap.ViewMode): void
}

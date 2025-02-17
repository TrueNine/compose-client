import {componentInstallToPlugin} from '@compose/extensions/vue'
import type {ViewMode} from '@compose/psdk-tmap'

import _c from './YMapTencent.vue'

export default componentInstallToPlugin(_c)

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
  mapZoomType?: TMap.constants.MAP_ZOOM_TYPE
}

export type YMapTencentEmits = (e: 'update:viewMode', v: ViewMode) => void

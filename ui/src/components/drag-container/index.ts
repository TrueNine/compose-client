import type {SFCWithInstall} from '@/common/install'

import {componentInstallToPlugin} from '@/common'
import _c from './YDragContainer.vue'

export interface YDragContainerProps {
  // 根据组件实际props定义，这里添加基本类型
}

export type YDragContainerEmits = Record<string, never>

const YDragContainer: SFCWithInstall<typeof _c> = componentInstallToPlugin(_c)
export default YDragContainer

import type { SFCWithInstall } from '@/common/install'

import { componentInstallToPlugin } from '@/common'
import _c from './YDragItem.vue'

export interface YDragItemProps {
  // 根据组件实际props定义，这里添加基本类型
}

export type YDragItemEmits = Record<string, never>

const YDragItem: SFCWithInstall<typeof _c> = componentInstallToPlugin(_c)
export default YDragItem

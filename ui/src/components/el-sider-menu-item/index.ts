import type { bool, RouteOption, StrOrNum } from '@truenine/types'
import type { SFCWithInstall } from '@/common/install'
import { componentInstallToPlugin } from '@/common'

import _c from './YElSiderMenuItem.vue'

export interface YElSiderMenuItemProps {
  hidden?: bool
  item: RouteOption
  collapsed?: bool
  iconName?: string
  idxKey?: StrOrNum
}

export type YElSiderMenuItemEmits = Record<string, never>

const YElSiderMenuItem: SFCWithInstall<typeof _c> = componentInstallToPlugin(_c)
export default YElSiderMenuItem

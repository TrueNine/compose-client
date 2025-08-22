import type { bool, RouteOption, StrOrNum } from '@truenine/types'
import { componentInstallToPlugin } from '@/common'

import _c from './YElSiderMenuItem.vue'

export interface YElSiderMenuItemProps {
  hidden?: bool
  item: RouteOption
  collapsed?: bool
  iconName?: string
  idxKey?: StrOrNum
}

const YElSiderMenuItem: any = componentInstallToPlugin(_c)
export default YElSiderMenuItem

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

export default componentInstallToPlugin(_c)

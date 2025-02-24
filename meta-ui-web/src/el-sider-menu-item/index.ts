import {componentInstallToPlugin} from '@compose/extensions/vue'
import type {RouteOption, StrOrNum, bool} from '@compose/api-types'

import _c from './YElSiderMenuItem.vue'

export interface YElSiderMenuItemProps {
  hidden?: bool
  item: RouteOption
  collapsed?: bool
  iconName?: string
  idxKey?: StrOrNum
}

export default componentInstallToPlugin(_c)

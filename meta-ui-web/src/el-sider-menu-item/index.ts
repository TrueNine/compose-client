import {Vue} from '@compose/extensions'
import type {RouteOption, StrOrNum, bool} from '@compose/api-types'

import _c from './YElSiderMenuItem.vue'

export interface YElSiderMenuItemProps {
  hidden?: bool
  item: RouteOption
  collapsed?: bool
  iconName?: string
  idxKey?: StrOrNum
}

export default Vue.componentInstallToPlugin(_c)

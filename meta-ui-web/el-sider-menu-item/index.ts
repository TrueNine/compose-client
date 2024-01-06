import {Vue} from '@compose/api-model'
import type {RouteOption, StrOrNum} from '@compose/api-types'

import _c from './YElSiderMenuItem.vue'

export interface YElSiderMenuItemProps {
  item: RouteOption
  collapsed?: boolean
  iconName?: string
  idxKey?: StrOrNum
}

export default Vue.componentInstallToPlugin(_c)

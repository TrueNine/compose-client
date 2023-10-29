import {Vue} from '@compose/api-model'
import type {RouteOption, StrOrNum} from '@compose/compose-types/src'

import _c from './YSiderMenuItem.vue'

export interface Props {
  item: RouteOption
  collapsed?: boolean
  iconName?: string
  idxKey?: StrOrNum
}

export default Vue.componentInstallToPlugin(_c)

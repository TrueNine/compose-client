import {Vue} from '@compose/api-model'
import type {bool, SafeAny} from '@compose/api-types'

import _c from './YVSystemBar.vue'

export default Vue.componentInstallToPlugin(_c)
export interface YSystemBarProps {
  showAppBar?: bool
}

export interface YVSystemBarSlots {
  default: () => SafeAny

  'app-title': () => SafeAny

  'app-settings': () => SafeAny

  'left-btn': () => SafeAny

  'right-btn': () => SafeAny

  'left-drawer': (props: {collapsed: boolean}) => SafeAny

  'settings-drawer': () => SafeAny
}

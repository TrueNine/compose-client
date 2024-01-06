import {Vue} from '@compose/api-model'
import type {SafeAny} from '@compose/api-types'

import _c from './YVSystemBar.vue'

export default Vue.componentInstallToPlugin(_c)

export interface YVSystemBarSlots {
  default(): SafeAny
  'app-title'(): SafeAny
  'app-settings'(): SafeAny
  'left-drawer'(props: {collapsed: boolean}): SafeAny
  'settings-drawer'(): SafeAny
}

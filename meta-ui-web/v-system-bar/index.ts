import {Vue} from '@compose/api-model'
import type {SafeAny} from '@compose/compose-types'

import _c from './YVSystemBar.vue'

export default Vue.componentInstallToPlugin(_c)

export interface Slots {
  default(): SafeAny
  'app-title'(): SafeAny
  'app-settings'(): SafeAny
  'left-drawer'(props: {collapsed: boolean}): SafeAny
  'settings-drawer'(): SafeAny
}
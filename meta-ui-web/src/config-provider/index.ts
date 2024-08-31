import {Vue} from '@compose/extensions'
import type {BCP47, int} from '@compose/api-types'

import _c from './YConfigProvider.vue'

export interface YConfigProviderProps {
  locale?: BCP47
  dark?: boolean
  elementPlusZIndex?: int
}

export default Vue.componentInstallToPlugin(_c)

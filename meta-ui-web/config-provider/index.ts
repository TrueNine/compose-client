import {Vue} from '@compose/api-model'
import type {BCP47} from '@compose/compose-types'

import _c from './YConfigProvider.vue'

export interface YConfigProviderProps {
  locale?: BCP47
  dark?: boolean
}

export default Vue.componentInstallToPlugin(_c)

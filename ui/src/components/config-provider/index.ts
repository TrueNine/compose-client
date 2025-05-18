import type { BCP47, i32 } from '@compose/types'
import { componentInstallToPlugin } from '@/common'

import _c from './YConfigProvider.vue'

export interface YConfigProviderProps {
  locale?: BCP47
  dark?: boolean
  elementPlusZIndex?: i32
}

export default componentInstallToPlugin(_c)

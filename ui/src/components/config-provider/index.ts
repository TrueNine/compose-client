import type { BCP47, i32 } from '@truenine/types'
import type { SFCWithInstall } from '@/common/install'
import { componentInstallToPlugin } from '@/common'

import _c from './YConfigProvider.vue'

export interface YConfigProviderProps {
  locale?: BCP47
  dark?: boolean
  elementPlusZIndex?: i32
}

export type YConfigProviderEmits = Record<string, never>

const YConfigProvider: SFCWithInstall<typeof _c> = componentInstallToPlugin(_c)

export default YConfigProvider

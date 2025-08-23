import type { SFCWithInstall } from '@/common/install'

import { componentInstallToPlugin } from '@/common'
import _c from './YConfigPreAuthorize.vue'

export interface YConfigPreAuthorizeProps {
  permissionsProvider?: () => string[]
  rolesProvider?: () => string[]
  authedProvider?: () => boolean
  anonymousProvider?: () => boolean
}

export type YConfigPreAuthorizeEmits = Record<string, never>

const YConfigPreAuthorize: SFCWithInstall<typeof _c> = componentInstallToPlugin(_c)
export default YConfigPreAuthorize

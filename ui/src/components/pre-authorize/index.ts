import type {SFCWithInstall} from '@/common/install'
import {componentInstallToPlugin} from '@/common'

import _c from './YPreAuthorize.vue'

export interface YPreAuthorizeProps {
  hasAnyPermissions?: string[]
  permissions?: string[]
  hasAnyRoles?: string[]
  roles?: string[]
  authed?: boolean
  anonymous?: boolean
}

export type YPreAuthorizeEmits = Record<string, never>

const YPreAuthorize: SFCWithInstall<typeof _c> = componentInstallToPlugin(_c)
export default YPreAuthorize

import { componentInstallToPlugin } from '@/common'

import _c from './YPreAuthorize.vue'

export interface YPreAuthorizeProps {
  hasAnyPermissions?: string[]
  permissions?: string[]
  hasAnyRoles?: string[]
  roles?: string[]
  authed?: boolean
  anonymous?: boolean
}

const YPreAuthorize: any = componentInstallToPlugin(_c)
export default YPreAuthorize

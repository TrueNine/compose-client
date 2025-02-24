import {componentInstallToPlugin} from '@compose/extensions/vue'

import _c from './YPreAuthorize.vue'

export interface YPreAuthorizeProps {
  hasAnyPermissions?: string[]
  permissions?: string[]
  hasAnyRoles?: string[]
  roles?: string[]
  authed?: boolean
  anonymous?: boolean
}

export default componentInstallToPlugin(_c)

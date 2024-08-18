import {Vue} from '@compose/extensions/vue'

import _c from './YPreAuthorize.vue'

export interface YPreAuthorizeProps {
  hasAnyPermissions?: string[]
  permissions?: string[]
  hasAnyRoles?: string[]
  roles?: string[]
  authed?: boolean
  anonymous?: boolean
}

export default Vue.componentInstallToPlugin(_c)

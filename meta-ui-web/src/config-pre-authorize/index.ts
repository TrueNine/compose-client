import { componentInstallToPlugin } from '@/common'

import _c from './YConfigPreAuthorize.vue'

export interface YConfigPreAuthorizeProps {
  permissionsProvider?: () => string[]
  rolesProvider?: () => string[]
  authedProvider?: () => boolean
  anonymousProvider?: () => boolean
}

export default componentInstallToPlugin(_c)

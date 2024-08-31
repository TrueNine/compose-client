import {Vue} from '@compose/extensions'

import _c from './YConfigPreAuthorize.vue'

export interface YConfigPreAuthorizeProps {
  permissionsProvider?: () => string[]
  rolesProvider?: () => string[]
  authedProvider?: () => boolean
  anonymousProvider?: () => boolean
}

export default Vue.componentInstallToPlugin(_c)

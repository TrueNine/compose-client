import {Vue} from '@compose/api-model'

import _c from './YConfigProvider.vue'

export interface Props {
  locale?: 'zh-cn' | 'en-us'
  dark?: boolean
}

export default Vue.componentInstallToPlugin(_c)

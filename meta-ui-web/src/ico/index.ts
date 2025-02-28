import { componentInstallToPlugin } from '@compose/extensions/vue'

import _c from './YIco.vue'

export interface YIcoProps {
  tag?: keyof HTMLElementTagNameMap
}

const a = componentInstallToPlugin(_c)
export default a

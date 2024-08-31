import {Vue} from '@compose/extensions'

import _c from './YIco.vue'

export interface YIcoProps {
  tag?: keyof HTMLElementTagNameMap
}

const a = Vue.componentInstallToPlugin(_c)
export default a

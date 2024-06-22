import {Vue} from '@compose/api-model'

import _c from './YIco.vue'

export interface YIcoProps {
  tag?: keyof HTMLElementTagNameMap
}

const a = Vue.componentInstallToPlugin<typeof _c>(_c)
export default a

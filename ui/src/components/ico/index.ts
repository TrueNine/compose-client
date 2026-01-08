import type {SFCWithInstall} from '@/common/install'
import {componentInstallToPlugin} from '@/common'

import _c from './YIco.vue'

export interface YIcoProps {
  tag?: keyof HTMLElementTagNameMap
}

export type YIcoEmits = Record<string, never>

const YIco: SFCWithInstall<typeof _c> = componentInstallToPlugin(_c)
export default YIco

import type {SFCWithInstall} from '@/common/install'

import {componentInstallToPlugin} from '@/common'
import _c from './YDebugCode.vue'

export type CodeLang = 'javascript' | 'json' | 'kotlin' | 'java'
export interface YDebugCodeProps {
  wrap?: boolean
  code?: string | null | Record<string, unknown> | object
  lang?: CodeLang
  title?: string | null
}

export type YDebugCodeEmits = Record<string, never>

const YDebugCode: SFCWithInstall<typeof _c> = componentInstallToPlugin(_c)

export default YDebugCode

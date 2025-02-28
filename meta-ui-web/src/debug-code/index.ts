import { componentInstallToPlugin } from '@compose/extensions/vue'

import _c from './YDebugCode.vue'

export type CodeLang = 'javascript' | 'json' | 'kotlin' | 'java'
export interface YDebugCodeProps {
  wrap?: boolean
  code?: string | null | Record<string, unknown> | object
  lang?: CodeLang
  title?: string | null
}
export default componentInstallToPlugin(_c)

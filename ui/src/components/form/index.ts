import type { SFCWithInstall } from '@/common/install'

import { componentInstallToPlugin } from '@/common'

import YFormComponent from './YForm.vue'

export * from './types'

const YForm: SFCWithInstall<typeof YFormComponent> = componentInstallToPlugin(YFormComponent)
export default YForm

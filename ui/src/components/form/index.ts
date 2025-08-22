import type { DefineComponent } from 'vue'
import type { YFormEmits, YFormProps } from './types'
import { componentInstallToPlugin } from '@/common'
import YFormComponent from './YForm.vue'

export * from './types'
const YForm: any = componentInstallToPlugin(YFormComponent as unknown as DefineComponent<YFormProps, YFormEmits>)
export default YForm

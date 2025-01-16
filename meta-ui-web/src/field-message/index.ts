import {Vue} from '@compose/extensions/vue'

import YFieldMessageSfc from './YFieldMessage.vue'
import type {ModelValueProps, ModelValueEmits} from '@/common/VuePropsCommon'

export interface YFieldMessageProps extends ModelValueProps<string[]> {
  name: string
}

export type YFieldMessageEmits = ModelValueEmits<string[]>

const YFieldMessage = Vue.componentInstallToPlugin(YFieldMessageSfc)

export default YFieldMessage

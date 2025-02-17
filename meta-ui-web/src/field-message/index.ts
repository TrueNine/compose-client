import {componentInstallToPlugin} from '@compose/extensions/vue'

import YFieldMessageSfc from './YFieldMessage.vue'
import type {ModelValueProps, ModelValueEmits} from '@/common/VuePropsCommon'

export interface YFieldMessageProps extends ModelValueProps<string[]> {
  name: string | string[]
}

export type YFieldMessageEmits = ModelValueEmits<string[]>

const YFieldMessage = componentInstallToPlugin(YFieldMessageSfc)

export default YFieldMessage

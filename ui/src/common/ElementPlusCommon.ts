import type { dynamic } from '@truenine/types'

import { dayjs } from 'element-plus'
import elementEnUs from 'element-plus/es/locale/lang/en'
import elementZhCn from 'element-plus/es/locale/lang/zh-cn'

const zhCn: dynamic = elementZhCn
const en: dynamic = elementEnUs

export { dayjs as ElementPlusDayjs, en as ElementPlusEn, zhCn as ElementPlusZhCn }

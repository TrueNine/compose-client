import type { dynamic } from '@truenine/types'

import { dayjs } from 'element-plus'
import elementEnUs from 'element-plus/dist/locale/en.mjs'
import elementZhCn from 'element-plus/dist/locale/zh-cn.mjs'

const zhCn: dynamic = elementZhCn
const en: dynamic = elementEnUs

export { dayjs as ElementPlusDayjs, en as ElementPlusEn, zhCn as ElementPlusZhCn }

import type { dynamic } from '@compose/api-types'
import { dayjs } from 'element-plus'
// eslint-disable-next-line ts/ban-ts-comment
// @ts-ignore
import elementEnUs from 'element-plus/dist/locale/en'
// eslint-disable-next-line ts/ban-ts-comment
// @ts-ignore
import elementZhCn from 'element-plus/dist/locale/zh-cn'

const zhCn = elementZhCn as dynamic
const en = elementEnUs as dynamic

export { dayjs as ElementPlusDayjs, en as ElementPlusEn, zhCn as ElementPlusZhCn }

// eslint-disable-next-line
// @ts-ignore
import elementZhCn from 'element-plus/dist/locale/zh-cn'
// eslint-disable-next-line
// @ts-ignore
import elementEnUs from 'element-plus/dist/locale/en'
import {dayjs} from 'element-plus'
import type {dynamic} from '@compose/api-types'

const zhCn = elementZhCn as dynamic
const en = elementEnUs as dynamic

export {zhCn as ElementPlusZhCn, en as ElementPlusEn, dayjs as ElementPlusDayjs}

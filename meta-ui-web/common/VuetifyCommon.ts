import {en as en, zhHans as zhCn} from 'vuetify/locale'
import {createVuetify, type VuetifyOptions} from 'vuetify'
import type {Late} from '@compose/api-types'
import DayjsAdaptor from '@date-io/dayjs'
import DateIoEn from 'dayjs/locale/en'
import DateIoZhCn from 'dayjs/locale/zh-cn'

function createVuetifyMount(optFn: (o: Late<VuetifyOptions>) => Late<VuetifyOptions>) {
  const opt = {
    date: {
      adapter: DayjsAdaptor,
      locale: {
        en: DateIoEn,
        'zh-CN': DateIoZhCn
      }
    },
    locale: {
      locale: 'zh-CN',
      fallback: 'en',
      messages: {
        'zh-CN': zhCn,
        en
      }
    }
  } as VuetifyOptions
  return createVuetify(Object.assign(opt, optFn(opt)))
}

export {en as VuetifyEn, zhCn as VuetifyZhCn, createVuetifyMount}

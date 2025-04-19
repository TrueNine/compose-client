import type { late } from '@compose/types'
import type { VuetifyOptions } from 'vuetify'
import DayjsAdaptor from '@date-io/dayjs'
import DateIoEn from 'dayjs/locale/en'
import DateIoZhCn from 'dayjs/locale/zh-cn'
import { createVuetify } from 'vuetify'
import { en, zhHans as zhCn } from 'vuetify/locale'

function createVuetifyMount(optFn: (o?: VuetifyOptions) => late<VuetifyOptions>): ReturnType<typeof createVuetify> {
  const opt = {
    date: {
      adapter: DayjsAdaptor,
      locale: {
        'en': DateIoEn,
        'zh-CN': DateIoZhCn,
      },
    },
    locale: {
      locale: 'zh-CN',
      fallback: 'en',
      messages: {
        'zh-CN': zhCn,
        en,
      },
    },
  } as VuetifyOptions
  return createVuetify(Object.assign(opt, optFn(opt)))
}

export { createVuetifyMount, en as VuetifyEn, zhCn as VuetifyZhCn }

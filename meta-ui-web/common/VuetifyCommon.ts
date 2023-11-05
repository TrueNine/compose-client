import {en as en, zhHans as zhCn} from 'vuetify/locale'
import {createVuetify, type VuetifyOptions} from 'vuetify'
import type {Late} from '@compose/compose-types'

function createVuetifyMount(optFn: (o: Late<VuetifyOptions>) => Late<VuetifyOptions>) {
  const opt = {
    locale: {
      locale: 'zh-CN',
      fallback: 'en',
      messages: {
        'zh-CN': zhCn,
        en: en
      }
    }
  }
  return createVuetify(Object.assign(opt, optFn(opt)))
}

export {en as VuetifyEn, zhCn as VuetifyZhCn, createVuetifyMount}

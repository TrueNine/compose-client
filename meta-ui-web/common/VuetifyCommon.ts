import {en as en, zhHans as zhCn} from 'vuetify/locale'
import {createVuetify, type VuetifyOptions} from 'vuetify'
import type {Late} from '@compose/compose-types'

function createVuetifyMount(optFn: (o: Late<VuetifyOptions>) => Late<VuetifyOptions>) {
  return createVuetify(
    optFn({
      locale: {
        locale: 'zh-CN',
        fallback: 'en',
        messages: {
          'zh-CN': zhCn,
          en: en
        }
      }
    })
  )
}

export {en as vuetifyEn, zhCn as vuetifyZhCn, createVuetifyMount}

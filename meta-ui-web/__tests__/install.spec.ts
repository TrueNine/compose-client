import {test} from 'vitest'
import {Vue} from '@compose/api-model'
import {mount} from '@vue/test-utils'

import YSiderMenu from '@/el-sider-menu/YElSiderMenu.vue'
import YSiderMenuItem from '@/el-sider-menu-item/YElSiderMenuItem.vue'

test('install', () => {
  const a = Vue.componentInstallToPlugin(YSiderMenu, {YSiderMenuItem})
  const wrapper = mount(YSiderMenu)
  console.log(wrapper)
  console.log(a)
})

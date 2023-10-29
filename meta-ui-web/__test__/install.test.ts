import {test} from 'vitest'
import {Vue} from '@compose/api-model'
import {mount} from '@vue/test-utils'

import YSiderMenu from '../sider-menu/YSiderMenu.vue'
import YSiderMenuItem from '../sider-menu-item/YSiderMenuItem.vue'

test('install', () => {
  const a = Vue.componentInstallToPlugin(YSiderMenu, {YSiderMenuItem})
  const wrapper = mount(YSiderMenu)
  console.log(wrapper)
  console.log(a)
})

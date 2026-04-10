import {describe, expect, it} from 'vitest'
import {mount} from '@vue/test-utils'
import YConfigPreAuthorize from './YConfigPreAuthorize.vue'

describe('YConfigPreAuthorize', () => {
  it('should provide pre-authorize injection', () => {
    const wrapper = mount(YConfigPreAuthorize, {
      props: {
        authedProvider: () => true,
        permissionsProvider: () => ['read'],
        rolesProvider: () => ['admin'],
        anonymousProvider: () => false
      }
    })
    const vm = wrapper.vm as unknown as Record<string, unknown>
    expect(vm.isAuthed).toBeDefined()
    expect(vm.hasAnyPermissions).toBeDefined()
    expect(vm.hasAnyRoles).toBeDefined()
  })

  it('should compute permissions correctly', () => {
    const wrapper = mount(YConfigPreAuthorize, {
      props: {
        authedProvider: () => true,
        permissionsProvider: () => ['read', 'write'],
        rolesProvider: () => ['admin'],
        anonymousProvider: () => false
      }
    })
    const vm = wrapper.vm as unknown as {
      hasAnyPermissions: (p: string[]) => boolean
      hasAnyRoles: (r: string[]) => boolean
      isAuthed: () => boolean
    }
    expect(vm.isAuthed()).toBe(true)
    expect(vm.hasAnyPermissions(['read'])).toBe(true)
    expect(vm.hasAnyPermissions(['delete'])).toBe(false)
    expect(vm.hasAnyRoles(['admin'])).toBe(true)
    expect(vm.hasAnyRoles(['user'])).toBe(false)
  })

  it('should render slot', () => {
    const wrapper = mount(YConfigPreAuthorize, {
      props: {},
      slots: {default: '<div class="content">ok</div>'}
    })
    expect(wrapper.find('.content').exists()).toBe(true)
  })
})

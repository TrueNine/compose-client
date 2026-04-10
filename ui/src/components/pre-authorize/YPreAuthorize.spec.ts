import {describe, expect, it} from 'vitest'
import {mount} from '@vue/test-utils'
import {computed, ref} from 'vue'
import YPreAuthorize from './YPreAuthorize.vue'
import {PreAuthorizeInjectionSymbol} from '@/common'
import type {PreAuthorizeInjection} from '@/common'

function createInjection(p: Partial<PreAuthorizeInjection> = {}): PreAuthorizeInjection {
  const permissions = p.permissions ?? ref([])
  return {
    hasAnyPermissions: p.hasAnyPermissions ?? (() => false),
    requirePermissions: p.requirePermissions ?? (() => {}),
    hasAnyRoles: p.hasAnyRoles ?? (() => false),
    requireRoles: p.requireRoles ?? (() => {}),
    isAuthed: p.isAuthed ?? (() => false),
    isAnonymous: p.isAnonymous ?? (() => true),
    permissions,
    roles: p.roles ?? ref([]),
    authed: p.authed ?? ref(false),
    anonymous: computed(() => !(p.authed?.value ?? false))
  }
}

describe('YPreAuthorize', () => {
  it('should throw when injection not provided', () => {
    expect(() => mount(YPreAuthorize)).toThrow('usePreAuthorize is not defined')
  })

  it('should render default slot when allowed', () => {
    const wrapper = mount(YPreAuthorize, {
      global: {provide: {[PreAuthorizeInjectionSymbol]: createInjection({authed: ref(true), permissions: ref(['read'])})}},
      slots: {default: '<div class="allowed">ok</div>'},
      props: {authed: true}
    })
    expect(wrapper.find('.allowed').exists()).toBe(true)
  })

  it('should render forbidden slot when not allowed', () => {
    const wrapper = mount(YPreAuthorize, {
      global: {provide: {[PreAuthorizeInjectionSymbol]: createInjection({authed: ref(false)})}},
      slots: {default: '<div class="allowed">ok</div>', forbidden: '<div class="forbidden">no</div>'},
      props: {authed: true}
    })
    expect(wrapper.find('.forbidden').exists()).toBe(true)
  })

  it('should check permissions', () => {
    const wrapper = mount(YPreAuthorize, {
      global: {provide: {[PreAuthorizeInjectionSymbol]: createInjection({permissions: ref(['read', 'write'])})}},
      slots: {default: '<div class="allowed">ok</div>'},
      props: {permissions: ['read']}
    })
    expect(wrapper.find('.allowed').exists()).toBe(true)
  })

  it('should check hasAnyPermissions', () => {
    const wrapper = mount(YPreAuthorize, {
      global: {provide: {[PreAuthorizeInjectionSymbol]: createInjection({permissions: ref(['read'])})}},
      slots: {default: '<div class="allowed">ok</div>'},
      props: {hasAnyPermissions: ['write', 'read']}
    })
    expect(wrapper.find('.allowed').exists()).toBe(true)
  })

  it('should check roles against permissions', () => {
    const wrapper = mount(YPreAuthorize, {
      global: {provide: {[PreAuthorizeInjectionSymbol]: createInjection({permissions: ref(['admin'])})}},
      slots: {default: '<div class="allowed">ok</div>'},
      props: {roles: ['admin']}
    })
    expect(wrapper.find('.allowed').exists()).toBe(true)
  })
})

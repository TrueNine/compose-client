import {describe, expect, it} from 'vitest'
import {mount} from '@vue/test-utils'
import {ref} from 'vue'
import {PreAuthorizeInjectionSymbol, usePreAuthorize} from './Yan100Common'
import type {PreAuthorizeInjection} from './Yan100Common'

function createWrapper(injection?: PreAuthorizeInjection) {
  return mount({
    setup() {
      return {result: usePreAuthorize()}
    },
    template: '<div />'
  }, {
    global: injection ? {provide: {[PreAuthorizeInjectionSymbol]: injection}} : {}
  })
}

describe('usePreAuthorize', () => {
  it('should return undefined when not provided', () => {
    const wrapper = createWrapper()
    expect(wrapper.vm.result).toBeUndefined()
  })

  it('should return injected value when provided', () => {
    const injection: PreAuthorizeInjection = {
      hasAnyPermissions: () => true,
      requirePermissions: () => {},
      hasAnyRoles: () => true,
      requireRoles: () => {},
      isAuthed: () => true,
      isAnonymous: () => false,
      permissions: ref([]),
      roles: ref([]),
      authed: ref(true),
      anonymous: ref(false)
    }
    const wrapper = createWrapper(injection)
    expect(wrapper.vm.result).toBe(injection)
  })
})

import {describe, expect, it} from 'vitest'
import {mount} from '@vue/test-utils'
import YIco from './YIco.vue'

describe('YIco', () => {
  it('should render default slot with i tag', () => {
    const wrapper = mount(YIco, {slots: {default: 'icon'}})
    expect(wrapper.element.tagName).toBe('I')
    expect(wrapper.text()).toBe('icon')
  })

  it('should render with custom tag', () => {
    const wrapper = mount(YIco, {props: {tag: 'span'}, slots: {default: 'icon'}})
    expect(wrapper.element.tagName).toBe('SPAN')
  })

  it('should have inline-block style', () => {
    const wrapper = mount(YIco)
    expect((wrapper.element as HTMLElement).style.display).toBe('inline-block')
  })

  it('should have text-6 class', () => {
    const wrapper = mount(YIco)
    expect(wrapper.classes()).toContain('text-6')
  })
})

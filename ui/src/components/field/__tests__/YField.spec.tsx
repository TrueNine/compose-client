import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import YForm from '../../form/index'
import YField from '../index'
import { ChildInputComponent } from './components/TestComponents'

afterEach(() => {
  document.body.innerHTML = ''
})

describe('yFieldTest', () => {
  describe('基础功能Group', () => {
    it('正常 初始化 条件时，应正确渲染子组件并传递标签', async () => {
      const wrapper = mount(YField, {
        props: {
          name: 'testField',
          label: '测试标签',
        },
        slots: {
          default: () => <ChildInputComponent />,
        },
      })

      await nextTick()
      const childComponent = wrapper.findComponent(ChildInputComponent)
      expect(childComponent.exists()).toBe(true)
      expect(childComponent.props('label')).toBe('测试标签')
    })

    it('正常 继承属性 条件时，应将非name和label属性传递给子组件', async () => {
      const wrapper = mount(YField, {
        props: {
          name: 'testField',
          label: '测试标签',
          placeholder: '请输入',
        },
        slots: {
          default: () => <ChildInputComponent />,
        },
      })

      await nextTick()
      const childComponent = wrapper.findComponent(ChildInputComponent)
      expect(childComponent.props('placeholder')).toBe('请输入')
    })
  })

  describe('表单集成Group', () => {
    it('正常 表单结构 条件时，应生成正确的YFieldProxyComponent', async () => {
      const wrapper = mount(YForm, {
        props: {
          initValue: { email: 'test@example.com' },
        },
        slots: {
          default: () => (
            <YField name="email" label="邮箱">
              <ChildInputComponent />
            </YField>
          ),
        },
        attachTo: document.body,
      })

      await nextTick()

      // 获取字段代理组件并验证它包含正确的modelNames
      const proxy = wrapper.findComponent({ name: 'YFieldProxyComponent' })
      expect(proxy.exists()).toBe(true)
      expect(proxy.props('modelNames')).toEqual({ email: 'modelValue' })
    })

    it('正常 字段映射 条件时，应将表单对象字段映射到代理组件', async () => {
      const wrapper = mount(YForm, {
        props: {
          initValue: { address: { code: '110000' } },
        },
        slots: {
          default: () => (
            <YField name={{ 'address.code': 'adCode' }} label="地址编码">
              <ChildInputComponent />
            </YField>
          ),
        },
        attachTo: document.body,
      })

      await nextTick()

      // 获取字段代理组件并验证它包含正确的modelNames
      const proxy = wrapper.findComponent({ name: 'YFieldProxyComponent' })
      expect(proxy.exists()).toBe(true)
      expect(proxy.props('modelNames')).toEqual({ 'address.code': 'adCode' })
    })
  })

  // 嵌套字段测试
  describe('多字段映射Group', () => {
    it('正常 映射 条件时，YField应正确将表单字段映射到代理组件', async () => {
      const wrapper = mount(YForm, {
        props: {
          initValue: {
            coord: { x: '100', y: '200' },
          },
        },
        slots: {
          default: () => (
            <YField
              name={{ 'coord.x': 'x', 'coord.y': 'y' }}
              label="坐标"
            >
              <ChildInputComponent />
            </YField>
          ),
        },
        attachTo: document.body,
      })

      await nextTick()

      // 验证字段代理组件的modelNames映射
      const proxy = wrapper.findComponent({ name: 'YFieldProxyComponent' })
      expect(proxy.exists()).toBe(true)
      expect(proxy.props('modelNames')).toEqual({ 'coord.x': 'x', 'coord.y': 'y' })
    })
  })
})

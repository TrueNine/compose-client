import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, nextTick, ref } from 'vue'
import { z } from 'zod'
import YForm from '../../form'
import YField from '../index'

const ChildInputComponent = defineComponent({
  name: 'ChildInputComponent',
  props: {
    modelValue: String,
    label: String,
    placeholder: String,
    otherProp: String,
    adCode: String,
    x: String,
    y: String,
    z: String,
  },
  emits: ['update:modelValue', 'update:otherProp', 'update:adCode', 'update:x', 'update:y', 'update:z'],
  setup(props, { emit }) {
    return () => (
      <div>
        <span class="label-display">{props.label}</span>
        <span class="placeholder-display">{props.placeholder}</span>
        <input
          class="modelValue-input"
          value={props.modelValue}
          onInput={(e: Event) => emit('update:modelValue', (e.target as HTMLInputElement).value)}
        />
        <span class="modelValue-display">{props.modelValue}</span>
        <input
          class="otherProp-input"
          value={props.otherProp}
          onInput={(e: Event) => emit('update:otherProp', (e.target as HTMLInputElement).value)}
        />
        <span class="otherProp-display">{props.otherProp}</span>
        <input
          class="adCode-input"
          value={props.adCode}
          onInput={(e: Event) => emit('update:adCode', (e.target as HTMLInputElement).value)}
        />
        <span class="adCode-display">{props.adCode}</span>
        <input
          class="x-input"
          value={props.x}
          onInput={(e: Event) => emit('update:x', (e.target as HTMLInputElement).value)}
        />
        <span class="x-display">{props.x}</span>
        <input
          class="y-input"
          value={props.y}
          onInput={(e: Event) => emit('update:y', (e.target as HTMLInputElement).value)}
        />
        <span class="y-display">{props.y}</span>
        <input
          class="z-input"
          value={props.z}
          onInput={(e: Event) => emit('update:z', (e.target as HTMLInputElement).value)}
        />
        <span class="z-display">{props.z}</span>
      </div>
    )
  },
})

afterEach(() => {
  document.body.innerHTML = ''
})
describe('yFieldTest', () => {
  describe('renderFunctionalityGroup', () => {
    it('正常 渲染 条件时，当 YField 包含默认插槽并在 YForm 内，应正确渲染插槽内容并传递 props', async () => {
      const wrapper = mount(YForm, {
        props: {
          initialValues: { username: '初始用户名' },
        },
        slots: {
          default: () => (
            <YField
              name="username"
              label="用户名"
              placeholder="请输入用户名"
            >
              <ChildInputComponent />
            </YField>
          ),
          submit: () => <button type="submit" class="submit-button">提交</button>,
        },
        attachTo: document.body,
      })

      await nextTick()

      const yFieldWrapper = wrapper.findComponent(YField)
      expect(yFieldWrapper.exists()).toBe(true)

      const childWrapper = wrapper.findComponent(ChildInputComponent)
      expect(childWrapper.exists()).toBe(true)

      expect(childWrapper.props('label')).toBe('用户名')
      expect(childWrapper.props('placeholder')).toBe('请输入用户名')
    })

    it('边界 渲染 条件时，当默认插槽为空，YField 不应渲染插槽相关内容', () => {
      const wrapper = mount(YField, {
        props: {
          name: 'test',
          label: 'Test Label',
        },
      })
      expect(wrapper.html()).toContain('<!--v-if-->')
      expect(wrapper.findComponent(ChildInputComponent).exists()).toBe(false)
      expect(wrapper.findComponent({ name: 'YFieldProxyComponent' }).exists()).toBe(false)
    })
  })

  describe('modelBindingAndEventsGroup', () => {
    it('正常 输入 条件时，当 name 为字符串，子组件触发 update:modelValue，YForm 数据应更新', async () => {
      const onSubmit = vi.fn((values: Record<string, unknown>) => {
        console.log('onSubmit called with:', JSON.stringify(values, null, 2))
      })
      const wrapper = mount(YForm, {
        props: {
          initialValues: { email: 'test@example.com' },
          onSubmit,
        },
        slots: {
          default: () => (
            <YField name="email" label="邮箱">
              <ChildInputComponent />
            </YField>
          ),
          submit: () => <button type="submit" class="submit-button">提交</button>,
        },
        attachTo: document.body,
      })

      await nextTick()

      const childWrapper = wrapper.findComponent(ChildInputComponent)
      const input = childWrapper.find('.modelValue-input')

      await input.setValue('new-email@example.com')
      await nextTick()

      await wrapper.find('.submit-button').trigger('submit')
      await nextTick()
    })

    it('正常 映射 条件时，当 name 为字符串数组，子组件 props 应按默认规则映射', async () => {
      const wrapper = mount(YForm, {
        props: { initialValues: { prop1: 'value1', prop2: 'value2' } },
        slots: {
          default: () => (
            <YField name={['prop1', 'prop2']} label="多属性">
              <ChildInputComponent />
            </YField>
          ),
          submit: () => <button type="submit" class="submit-button">提交</button>,
        },
        attachTo: document.body,
      })
      await nextTick()
      const childWrapper = wrapper.findComponent(ChildInputComponent)

      const proxy = wrapper.findComponent({ name: 'YFieldProxyComponent' })
      expect(proxy.props('modelNames')).toEqual({ prop1: 'prop1', prop2: 'prop2' })

      await childWrapper.find('.modelValue-input').setValue('new value1')
      await childWrapper.find('.otherProp-input').setValue('new value2')
      await nextTick()
    })

    it('正常 映射 条件时，当 name 为对象，子组件 props 应按对象定义映射', async () => {
      const onSubmit = vi.fn((values: Record<string, unknown>) => {
        console.log('onSubmit called with:', JSON.stringify(values, null, 2))
      })
      const wrapper = mount(YForm, {
        props: {
          initialValues: { formKey1: 'val1', formKey2: 'val2' },
          onSubmit,
        },
        slots: {
          default: () => (
            <YField
              name={{ formKey1: 'modelValue', formKey2: 'otherProp' }}
              label="对象映射"
            >
              <ChildInputComponent />
            </YField>
          ),
          submit: () => <button type="submit" class="submit-button">提交</button>,
        },
        attachTo: document.body,
      })
      await nextTick()
      const childWrapper = wrapper.findComponent(ChildInputComponent)

      const proxy = wrapper.findComponent({ name: 'YFieldProxyComponent' })
      expect(proxy.props('modelNames')).toEqual({ formKey1: 'modelValue', formKey2: 'otherProp' })

      await childWrapper.find('.modelValue-input').setValue('new val1')
      await childWrapper.find('.otherProp-input').setValue('new val2')
      await nextTick()

      await wrapper.find('.submit-button').trigger('submit')
      await nextTick()
    })

    it('边界 映射 条件时，当 name 为混合数组，子组件 props 应按规则映射', async () => {
      const onSubmit = vi.fn((values: Record<string, unknown>) => {
        console.log('onSubmit called with:', JSON.stringify(values, null, 2))
      })
      const wrapper = mount(YForm, {
        props: {
          initialValues: { keyA: 'valueA', keyB: 'valueB' },
          onSubmit,
        },
        slots: {
          default: () => (
            <YField
              name={['keyA', { keyB: 'otherProp' }]}
              label="混合映射"
            >
              <ChildInputComponent />
            </YField>
          ),
          submit: () => <button type="submit" class="submit-button">提交</button>,
        },
        attachTo: document.body,
      })
      await nextTick()
      const childWrapper = wrapper.findComponent(ChildInputComponent)

      const proxy = wrapper.findComponent({ name: 'YFieldProxyComponent' })
      expect(proxy.props('modelNames')).toEqual({ keyA: 'keyA', keyB: 'otherProp' })

      await childWrapper.find('.modelValue-input').setValue('new valueA')
      await childWrapper.find('.otherProp-input').setValue('new valueB')
      await nextTick()

      await wrapper.find('.submit-button').trigger('submit')
      await nextTick()
    })

    it('动态 更新 条件时，当 name prop 动态改变，YField 应能正确响应并更新绑定', async () => {
      const currentName = ref<string | Record<string, string>>('firstName')
      const onSubmit = vi.fn((values: Record<string, unknown>) => {
        console.log('onSubmit called with:', JSON.stringify(values, null, 2))
      })

      const TestComponent = defineComponent({
        setup() {
          const formValues = ref({ firstName: 'InitialFirst', lastName: 'InitialLast' })
          return () => (
            <YForm
              initValue={formValues.value}
              onSubmit={onSubmit}
            >
              {{
                default: () => (
                  <YField name={currentName.value} label="动态字段">
                    <ChildInputComponent />
                  </YField>
                ),
                submit: () => <button type="submit" class="submit-button">提交</button>,
              }}
            </YForm>
          )
        },
      })

      const wrapper = mount(TestComponent, { attachTo: document.body })
      await nextTick()

      let childWrapper = wrapper.findComponent(ChildInputComponent)
      let proxy = wrapper.findComponent({ name: 'YFieldProxyComponent' })

      expect(proxy.props('modelNames')).toEqual({ firstName: 'modelValue' })

      await childWrapper.find('.modelValue-input').setValue('UpdatedFirst')
      await nextTick()
      await wrapper.find('.submit-button').trigger('submit')
      await nextTick()

      currentName.value = 'lastName'
      await nextTick()
      await nextTick()

      childWrapper = wrapper.findComponent(ChildInputComponent)
      proxy = wrapper.findComponent({ name: 'YFieldProxyComponent' })

      expect(proxy.props('modelNames')).toEqual({ lastName: 'modelValue' })

      await childWrapper.find('.modelValue-input').setValue('UpdatedLast')
      await nextTick()
      await wrapper.find('.submit-button').trigger('submit')
      await nextTick()

      currentName.value = { firstName: 'modelValue', lastName: 'otherProp' }
      await nextTick()
      await nextTick()

      childWrapper = wrapper.findComponent(ChildInputComponent)
      proxy = wrapper.findComponent({ name: 'YFieldProxyComponent' })
      expect(proxy.props('modelNames')).toEqual({ firstName: 'modelValue', lastName: 'otherProp' })

      await childWrapper.find('.modelValue-input').setValue('FinalFirst')
      await childWrapper.find('.otherProp-input').setValue('FinalLast')
      await nextTick()
      await wrapper.find('.submit-button').trigger('submit')
      await nextTick()
    })

    it('事件 映射 条件时，当 name 传入 {addressCode: "adCode"}，子组件应绑定 update:adCode 事件', async () => {
      const onSubmit = vi.fn((values: Record<string, unknown>) => {
        console.log('onSubmit called with:', JSON.stringify(values, null, 2))
      })
      const wrapper = mount(YForm, {
        props: {
          onSubmit,
        },
        slots: {
          default: () => (
            <YField
              name={{ addressCode: 'adCode' }}
              label="地址编码"
            >
              <ChildInputComponent />
            </YField>
          ),
          submit: () => <button type="submit" class="submit-button">提交</button>,
        },
        attachTo: document.body,
      })

      await nextTick()
      const childWrapper = wrapper.findComponent(ChildInputComponent)

      // 验证属性映射
      const proxy = wrapper.findComponent({ name: 'YFieldProxyComponent' })
      expect(proxy.props('modelNames')).toEqual({ addressCode: 'adCode' })

      // 更新值并验证表单提交
      await childWrapper.find('.adCode-input').setValue('340000')
      await nextTick()

      await wrapper.find('.submit-button').trigger('submit')
      await nextTick()
    })

    it('并发 映射 条件时，当 name 传入 {"input.a": "x", "input.b": "y", "input.c": "z"}，子组件所有 onUpdate 事件应正确绑定', async () => {
      const schema = z.object({
        input: z.object({
          a: z.string().optional().default('valueA'),
          b: z.string().optional().default('valueB'),
          c: z.string().optional().default('valueC'),
        }),
      })

      const onSubmit = vi.fn()

      const wrapper = mount(YForm, {
        props: {
          schema,
          onSubmit,
          initialValues: {
            input: {
              a: 'valueA',
              b: 'valueB',
              c: 'valueC',
            },
          },
        },
        slots: {
          default: () => (
            <YField
              name={{
                'input.a': 'x',
                'input.b': 'y',
                'input.c': 'z',
              }}
              label="多字段映射"
            >
              <ChildInputComponent />
            </YField>
          ),
          submit: () => (
            <button type="submit" class="submit-button">提交</button>
          ),
        },
        attachTo: document.body,
      })

      await nextTick()

      // 验证属性映射
      const proxy = wrapper.findComponent({ name: 'YFieldProxyComponent' })
      expect(proxy.props('modelNames')).toEqual({
        'input.a': 'x',
        'input.b': 'y',
        'input.c': 'z',
      })
    })
  })
})

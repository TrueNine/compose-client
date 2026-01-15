import {mount} from '@vue/test-utils'
import {afterEach, describe, expect, it} from 'vitest'
import {defineComponent, markRaw, nextTick, ref} from 'vue'
import {z} from 'zod'
import YForm from '../../form'
import YField from '../index'
import YFieldProxyComponent from '../YFieldProxyComponent.vue'
import {ChildInputComponent} from './components/TestComponents'

const globalComponents = {components: {YField, YFieldProxyComponent}}

afterEach(() => document.body.innerHTML = '')

describe('yFieldProxyComponentTest', () => {
  describe('模型名称映射Group', () => {
    it('正常 单字段 条件时，当name为字符串，modelNames应包含modelValue映射', async () => {
      const wrapper = mount(YForm, {props: {initValue: {email: 'test@example.com'}}, slots: {default: () => (
        <YField name="email" label="邮箱">
          <ChildInputComponent />
        </YField>
      )}, global: globalComponents})

      await nextTick()
      const proxy = wrapper.findComponent({name: 'YFieldProxyComponent'})
      expect(proxy.props('modelNames')).toEqual({email: 'modelValue'})
    })

    it('正常 映射 条件时，当name为字符串数组，modelNames应按默认规则映射', async () => {
      const wrapper = mount(YForm, {props: {initValue: {prop1: 'value1', prop2: 'value2'}}, slots: {default: () => (
        <YField name={['prop1', 'prop2']} label="多属性">
          <ChildInputComponent />
        </YField>
      )}, global: globalComponents})

      await nextTick()
      const proxy = wrapper.findComponent({name: 'YFieldProxyComponent'})
      expect(proxy.props('modelNames')).toEqual({prop1: 'prop1', prop2: 'prop2'})
    })

    it('正常 映射 条件时，当name为对象，modelNames应按对象定义映射', async () => {
      const wrapper = mount(YForm, {props: {initValue: {formKey1: 'val1', formKey2: 'val2'}}, slots: {default: () => (
        <YField
          name={{formKey1: 'modelValue', formKey2: 'otherProp'}}
          label="对象映射"
        >
          <ChildInputComponent />
        </YField>
      )}, global: globalComponents})

      await nextTick()
      const proxy = wrapper.findComponent({name: 'YFieldProxyComponent'})
      expect(proxy.props('modelNames')).toEqual({formKey1: 'modelValue', formKey2: 'otherProp'})
    })

    it('边界 映射 条件时，当name为混合数组，modelNames应按规则映射', async () => {
      const wrapper = mount(YForm, {props: {initValue: {keyA: 'valueA', keyB: 'valueB'}}, slots: {default: () => (
        <YField
          name={['keyA', {keyB: 'otherProp'}]}
          label="混合映射"
        >
          <ChildInputComponent />
        </YField>
      )}, global: globalComponents})

      await nextTick()
      const proxy = wrapper.findComponent({name: 'YFieldProxyComponent'})
      expect(proxy.props('modelNames')).toEqual({keyA: 'keyA', keyB: 'otherProp'})
    })
  })

  describe('动态模型更新Group', () => {
    it('动态 更新 条件时，当name prop动态改变，modelNames应正确响应并更新', async () => {
      const currentName = ref<string | Record<string, string> | (string | Record<string, string>)[]>('firstName')

      const TestComponent = defineComponent({setup() {
        const formValues = ref({firstName: 'InitialFirst', lastName: 'InitialLast', addr: 'Addr1'})
        return () => (
          <YForm initValue={formValues.value}>
            <YField name={currentName.value} label="动态字段">
              <ChildInputComponent />
            </YField>
          </YForm>
        )
      }})

      const wrapper = mount(TestComponent, {global: globalComponents})
      await nextTick()

      let proxy = wrapper.findComponent({name: 'YFieldProxyComponent'}) // 单字符串默认映射到 modelValue
      expect(proxy.props('modelNames')).toEqual({firstName: 'modelValue'})

      currentName.value = 'lastName' // 切换为字符串
      await nextTick()

      proxy = wrapper.findComponent({name: 'YFieldProxyComponent'})
      expect(proxy.props('modelNames')).toEqual({lastName: 'modelValue'})

      currentName.value = {firstName: 'modelValue', lastName: 'otherProp'} // 切换为对象
      await nextTick()

      proxy = wrapper.findComponent({name: 'YFieldProxyComponent'})
      expect(proxy.props('modelNames')).toEqual({firstName: 'modelValue', lastName: 'otherProp'})

      currentName.value = ['firstName', 'lastName'] // 切换为数组
      await nextTick()

      proxy = wrapper.findComponent({name: 'YFieldProxyComponent'})
      expect(proxy.props('modelNames')).toEqual({firstName: 'firstName', lastName: 'lastName'})

      currentName.value = ['firstName', {lastName: 'otherProp'}, {addr: 'adCode'}] // 切换为混合数组
      await nextTick()

      proxy = wrapper.findComponent({name: 'YFieldProxyComponent'})
      expect(proxy.props('modelNames')).toEqual({firstName: 'firstName', lastName: 'otherProp', addr: 'adCode'})
    })
  })

  describe('特殊映射Group', () => {
    it('复杂路径 映射 条件时，当name传入嵌套路径，modelNames应正确映射', async () => {
      const schema = z.object({input: z.object({a: z.string().optional().default('valueA'), b: z.string().optional().default('valueB'), c: z.string().optional().default('valueC')})})

      const wrapper = mount(YForm, {props: {schema, initValue: {input: {a: 'valueA', b: 'valueB', c: 'valueC'}}}, slots: {default: () => (
        <YField
          name={{'input.a': 'x', 'input.b': 'y', 'input.c': 'z'}}
          label="多字段映射"
        >
          <ChildInputComponent />
        </YField>
      )}, global: globalComponents})

      await nextTick()
      const proxy = wrapper.findComponent({name: 'YFieldProxyComponent'})
      expect(proxy.props('modelNames')).toEqual({'input.a': 'x', 'input.b': 'y', 'input.c': 'z'})
    })

    it('直接实例化 条件时，应保持单个modelNames的一致性', async () => {
      const TestComponent = markRaw({template: '<div>测试组件</div>'}) // 准备测试组件

      const wrapper = mount(YFieldProxyComponent, {props: {component: TestComponent, modelNames: {addressCode: 'adCode'}}}) // 挂载组件并传入需要测试的 modelNames

      await nextTick()

      const vm = wrapper.vm as any // 获取组件实例

      expect(vm._modelNames).toEqual({addressCode: 'adCode'}) // 断言 _modelNames 保持与传入的 modelNames 一致
    })
  })
})

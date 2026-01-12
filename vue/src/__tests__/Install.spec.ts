import type {App} from 'vue'
import {describe, expect, it, vi} from 'vitest'
import {componentInstallToPlugin} from '../Install'

describe('componentInstallToPlugin', () => {
  function createMockApp() {
    return {component: vi.fn()} as unknown as App
  }

  it('返回的组件包含install方法', () => {
    const comp = {name: 'TestComp'}
    const plugin = componentInstallToPlugin(comp) as typeof comp & {install: (app: App) => void}
    expect(typeof plugin.install).toBe('function')
  })

  it('install时注册主组件，优先用name', () => {
    const comp = {name: 'TestComp'}
    const app = createMockApp()
    const plugin = componentInstallToPlugin(comp) as typeof comp & {install: (app: App) => void}
    plugin.install(app)

    expect(app.component).toHaveBeenCalledWith('TestComp', expect.objectContaining({name: 'TestComp'}))
  })

  it('install时注册主组件，name为空用__name', () => {
    const comp = {__name: 'TestComp2'}
    const app = createMockApp()
    const plugin = componentInstallToPlugin(comp) as typeof comp & {install: (app: App) => void}
    plugin.install(app)

    expect(app.component).toHaveBeenCalledWith('TestComp2', expect.objectContaining({__name: 'TestComp2'}))
  })

  it('install时注册主组件，name和__name都无时抛出异常', () => {
    const comp = {foo: 1}
    const app = createMockApp()
    const plugin = componentInstallToPlugin(comp) as typeof comp & {install: (app: App) => void}
    expect(() => plugin.install(app)).toThrowError('组件缺少有效的 name 或 __name 属性，无法注册到 app.component')
  })

  it('能注册附加组件', () => {
    const comp = {name: 'MainComp'}
    const other = {Sub1: {name: 'SubComp1'}, Sub2: {__name: 'SubComp2'}}
    const app = createMockApp()
    const plugin = componentInstallToPlugin(comp, other) as typeof comp & {install: (app: App) => void} & {Sub1: typeof other.Sub1, Sub2: typeof other.Sub2}
    plugin.install(app)

    expect(app.component).toHaveBeenCalledWith('MainComp', expect.any(Object))

    expect(app.component).toHaveBeenCalledWith('SubComp1', expect.any(Object))

    expect(app.component).toHaveBeenCalledWith('SubComp2', expect.any(Object))
    // 返回对象应包含附加组件
    expect(plugin.Sub1).toBeDefined()
    expect(plugin.Sub2).toBeDefined()
  })

  it('附加组件为空对象时不报错', () => {
    const comp = {name: 'MainComp'}
    const app = createMockApp()
    const plugin = componentInstallToPlugin(comp, {}) as typeof comp & {install: (app: App) => void}
    plugin.install(app)

    expect(app.component).toHaveBeenCalledWith('MainComp', expect.any(Object))
  })
})

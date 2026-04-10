import {describe, expect, it, vi} from 'vitest'
import type {App} from 'vue'
import {componentInstallToPlugin} from './install'

describe('componentInstallToPlugin', () => {
  function createMockApp() {
    const components: Record<string, unknown> = {}
    return {
      component: vi.fn((name: string, comp: unknown) => {
        components[name] = comp
      }),
      _components: components
    } as unknown as App
  }

  it('should add install method to component', () => {
    const comp = {name: 'TestComp'}
    const result = componentInstallToPlugin(comp)
    expect(typeof result.install).toBe('function')
  })

  it('should install component by name', () => {
    const app = createMockApp()
    const comp = {name: 'TestComp'}
    const plugin = componentInstallToPlugin(comp)
    plugin.install(app)
    expect(app.component).toHaveBeenCalledWith('TestComp', expect.objectContaining({name: 'TestComp'}))
  })

  it('should fallback to __name when name is missing', () => {
    const app = createMockApp()
    const comp = {__name: 'FallbackName'}
    const plugin = componentInstallToPlugin(comp)
    plugin.install(app)
    expect(app.component).toHaveBeenCalledWith('FallbackName', expect.anything())
  })

  it('should fallback to NameUndefined when both name and __name missing', () => {
    const app = createMockApp()
    const comp = {}
    const plugin = componentInstallToPlugin(comp)
    plugin.install(app)
    expect(app.component).toHaveBeenCalledWith('NameUndefined', expect.anything())
  })

  it('should install additional components when provided', () => {
    const app = createMockApp()
    const mainComp = {name: 'Main'}
    const otherComp = {name: 'Other'}
    const plugin = componentInstallToPlugin(mainComp, {Secondary: otherComp})
    plugin.install(app)
    expect(app.component).toHaveBeenCalledWith('Main', expect.anything())
    expect(app.component).toHaveBeenCalledWith('Other', expect.anything())
  })

  it('should expose additional components on returned object', () => {
    const mainComp = {name: 'Main'}
    const otherComp = {name: 'Other'}
    const plugin = componentInstallToPlugin(mainComp, {Secondary: otherComp})
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((plugin as any).Secondary).toBe(otherComp)
  })
})

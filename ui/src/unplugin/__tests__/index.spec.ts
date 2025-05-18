import { describe, expect, it } from 'vitest'
import { MetaUiWebResolver } from '../index'

describe('metaUiWebResolver', () => {
  const resolvers = MetaUiWebResolver()
  it('返回值应为数组且包含 type 和 resolve', () => {
    expect(Array.isArray(resolvers)).toBe(true)
    expect(resolvers[0]).toHaveProperty('type', 'component')
    expect(typeof resolvers[0].resolve).toBe('function')
  })

  it('resolve 能正确解析以 Y 开头的组件名', () => {
    const { resolve } = resolvers[0]
    const result = resolve('YButton')
    expect(result).toBeDefined()
    expect(result?.name).toBe('default')
    expect(result?.from).toBe('@compose/ui/components/button/index')
    expect(Array.isArray(result?.satisfies)).toBe(true)
    expect(result?.satisfies[0]).toBe('@compose/ui/dist/components/button/index.css')
  })

  it('resolve 对不符合规则的组件名应返回 undefined', () => {
    const { resolve } = resolvers[0]
    expect(resolve('Button')).toBeUndefined()
    expect(resolve('yButton')).toBeUndefined()
    expect(resolve('VButton')).toBeUndefined()
    expect(resolve('')).toBeUndefined()
  })

  it('resolve 解析不同 Y 开头组件名的 satisfies 路径', () => {
    const { resolve } = resolvers[0]
    const result = resolve('YTestComponent')
    expect(result?.from).toBe('@compose/ui/components/test-component/index')
    expect(result?.satisfies[0]).toBe('@compose/ui/dist/components/test-component/index.css')
    expect(result?.name).toBe('default')
  })
})

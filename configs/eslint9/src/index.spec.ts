import {describe, expect, it} from 'vitest'
import defineConfig, {plugin, rules} from './index'

describe('eslint9 compatibility shell', () => {
  it('re-exports defineConfig as a function', () => expect(typeof defineConfig).toBe('function'))

  it('re-exports plugin metadata', () => {
    expect(typeof plugin).toBe('object')
    expect(plugin.meta?.name).toBe('@truenine/eslint-plugin')
  })

  it('re-exports rules from eslint10', () => {
    expect(typeof rules).toBe('object')
    expect(Object.keys(rules).length).toBeGreaterThan(0)
  })

  it('delegates config creation to eslint10', async () => {
    const config = await defineConfig({vue: true, uniapp: true})
    expect(Array.isArray(config)).toBe(true)
  }, 20_000)
})

import {describe, expect, it} from 'vitest'
import eslint9, {applyPreset} from './index'

describe('eslint9-config', () => {
  it('should export default function', () => {
    expect(typeof eslint9).toBe('function')
  })

  it('should export applyPreset function', () => {
    expect(typeof applyPreset).toBe('function')
  })

  it('should return a promise', async () => {
    const result = eslint9()
    expect(result).toBeInstanceOf(Promise)
  })

  it('should work with applyPreset', async () => {
    const result = applyPreset()
    expect(result).toBeInstanceOf(Promise)
  })
})

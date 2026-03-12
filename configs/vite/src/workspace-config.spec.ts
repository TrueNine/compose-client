import {join} from 'node:path'
import {fileURLToPath} from 'node:url'
import {describe, expect, it, vi} from 'vitest'
import {createLibraryTsdownConfig, createLibraryViteConfig, createLibraryVitestConfig} from './workspace-config'

const importMeta = {url: 'file:///C:/workspace/example/vite.config.ts'}

describe('workspace config helpers', () => {
  it('creates a shared library vite config with src alias', () => {
    const config = createLibraryViteConfig(importMeta)
    expect(config.resolve?.alias).toEqual({'@': fileURLToPath(new URL('./src', importMeta.url))})
  })

  it('creates a shared vitest config rooted at the package directory', () => {
    const config = createLibraryVitestConfig(importMeta)
    expect(config.test?.environment).toBe('jsdom')
    expect(config.test?.root).toBe(fileURLToPath(new URL('./', importMeta.url)))
    expect(config.test?.exclude).toContain('e2e/*')
  })

  it('falls back to process cwd when vitest executes config from .vite-temp', () => {
    const cwdSpy = vi.spyOn(process, 'cwd').mockReturnValue('C:/workspace/example')

    try {
      const config = createLibraryVitestConfig({url: 'file:///C:/workspace/example/node_modules/.vite-temp/vitest.config.ts'})
      expect(config.test?.root).toBe('C:/workspace/example')
    } finally {
      cwdSpy.mockRestore()
    }
  })

  it('uses process cwd for src alias when config executes from .vite-temp', () => {
    const cwdSpy = vi.spyOn(process, 'cwd').mockReturnValue('C:/workspace/example')

    try {
      const config = createLibraryViteConfig({url: 'file:///C:/workspace/example/node_modules/.vite-temp/vite.config.ts'})
      expect(config.resolve?.alias).toEqual({'@': join('C:/workspace/example', 'src')})
    } finally {
      cwdSpy.mockRestore()
    }
  })

  it('creates a tsdown config with library defaults', () => {
    const config = createLibraryTsdownConfig()
    expect(config.platform).toBe('neutral')
    expect(config.unbundle).toBe(true)
    expect(config.format).toEqual(['esm'])
    expect(config.deps).toMatchObject({skipNodeModulesBundle: true})
    expect(config.dts).toMatchObject({sourcemap: true, tsconfig: './tsconfig.lib.json'})
  })
})

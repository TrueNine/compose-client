import {describe, expect, it} from 'vitest'
import {breakpoints} from './Breakpoints'
import {CssVar} from './CssVar'
import {defaultConfig} from './UnoConfig'
import {unoRules} from './Rules'
import {shortCuts} from './ShortCuts'

describe('uno config modules', () => {
  describe('breakpoints', () => {
    it('should define responsive breakpoints', () => {
      expect(breakpoints.xs).toBe('600px')
      expect(breakpoints.sm).toBe('960px')
      expect(breakpoints.md).toBe('1280px')
      expect(breakpoints.lg).toBe('1920px')
      expect(breakpoints.xl).toBe('2560px')
      expect(breakpoints.xxl).toBe('2560px')
    })
  })

  describe('CssVar', () => {
    it('should build css variable definition string', () => {
      const cv = new CssVar('primary', '#123456')
      expect(cv.varName).toBe('--primary')
      expect(cv.varValue).toBe('#123456')
      expect(cv.defineCssVar).toBe('--primary: #123456;')
      expect(cv.useVar).toBe('var(--primary)')
      expect(cv.toString()).toBe('--primary: #123456;')
    })
  })

  describe('unoRules', () => {
    it('should return rules with css var fallbacks when colors not provided', () => {
      const rules = unoRules({})
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const map = Object.fromEntries(rules.map(r => [r[0], (r as any)[1]]))
      expect(map['c-p']).toEqual({color: 'var(--primary-color)'})
      expect(map['bg-p']).toEqual({'background-color': 'var(--primary-color)'})
      expect(map['w-fit']).toEqual({width: 'fit-content'})
      expect(map['h-fit']).toEqual({height: 'fit-content'})
    })

    it('should use provided colors over fallbacks', () => {
      const rules = unoRules({primaryColor: 'red', errorColor: 'blue'})
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const map = Object.fromEntries(rules.map(r => [r[0], (r as any)[1]]))
      expect(map['c-p']).toEqual({color: 'red'})
      expect(map['bg-e']).toEqual({'background-color': 'blue'})
    })
  })

  describe('shortCuts', () => {
    it('should return expected shortcut definitions', () => {
      const sc = Object.fromEntries(shortCuts())
      expect(sc['wh-full']).toBe('w-full h-full')
      expect(sc['f-c']).toBe('flex justify-center items-center')
      expect(sc['text-ellipsis']).toBe('truncate')
    })
  })

  describe('defaultConfig', () => {
    it('should return a UserConfig object with presets and shortcuts', () => {
      const cfg = defaultConfig()
      expect(cfg.presets).toHaveLength(4)
      expect(cfg.shortcuts).toBeDefined()
      expect(cfg.rules).toBeDefined()
      expect(cfg.theme?.breakpoints).toBe(breakpoints)
      expect(cfg.transformers).toHaveLength(1)
    })
  })
})

import {describe, expect, it} from 'vitest'
import {AuditCategory, DEFAULT_HOST, DEFAULT_PORT, DISCOVERY_TIMEOUT, PORT_RANGE_END, PORT_RANGE_START, SERVER_SIGNATURE} from './constants'

describe('mcp constants', () => {
  it('should define audit categories', () => {
    expect(AuditCategory.ACCESSIBILITY).toBe('accessibility')
    expect(AuditCategory.PERFORMANCE).toBe('performance')
    expect(AuditCategory.SEO).toBe('seo')
    expect(AuditCategory.BEST_PRACTICES).toBe('best-practices')
    expect(AuditCategory.PWA).toBe('pwa')
  })

  it('should define network constants', () => {
    expect(DEFAULT_PORT).toBe(3025)
    expect(DEFAULT_HOST).toBe('127.0.0.1')
    expect(SERVER_SIGNATURE).toBe('mcp-browser-connector-24x7')
    expect(DISCOVERY_TIMEOUT).toBe(1000)
    expect(PORT_RANGE_START).toBe(3025)
    expect(PORT_RANGE_END).toBe(3035)
  })
})

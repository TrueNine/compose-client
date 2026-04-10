import {describe, expect, it} from 'vitest'
import {AuditCategory} from './types'

describe('lighthouse types', () => {
  it('should define audit categories', () => {
    expect(AuditCategory.ACCESSIBILITY).toBe('accessibility')
    expect(AuditCategory.PERFORMANCE).toBe('performance')
    expect(AuditCategory.SEO).toBe('seo')
    expect(AuditCategory.BEST_PRACTICES).toBe('best-practices')
    expect(AuditCategory.PWA).toBe('pwa')
  })
})

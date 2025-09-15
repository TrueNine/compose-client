/**
 * Audit categories available in Lighthouse
 */
export enum AuditCategory {
  ACCESSIBILITY = 'accessibility',
  PERFORMANCE = 'performance',
  SEO = 'seo',
  // Not yet implemented
  BEST_PRACTICES = 'best-practices',
  // Not yet implemented
  PWA = 'pwa',
}

/**
 * Base interface for Lighthouse report metadata
 */
export interface LighthouseReport<T = unknown> {
  metadata: {
    url: string
    // ISO 8601, e.g., "2025-02-27T14:30:00Z"
    timestamp: string
    // e.g., "mobile", "desktop"
    device: string
    // e.g., "10.4.0"
    lighthouseVersion: string
  }

  // For backward compatibility with existing report formats
  overallScore?: number
  failedAuditsCount?: number
  passedAuditsCount?: number
  manualAuditsCount?: number
  informativeAuditsCount?: number
  notApplicableAuditsCount?: number
  failedAudits?: unknown[]

  // New format for specialized reports
  // Generic report data that will be specialized by each audit type
  report?: T
}

/**
 * Configuration options for Lighthouse audits
 */
export interface LighthouseConfig {
  flags: {
    output: string[]
    onlyCategories: string[]
    formFactor: string
    port: number | undefined
    screenEmulation: {
      mobile: boolean
      width: number
      height: number
      deviceScaleFactor: number
      disabled: boolean
    }
  }
  config: {
    extends: string
    settings: {
      onlyCategories: string[]
      emulatedFormFactor: string
      throttling: {
        cpuSlowdownMultiplier: number
      }
    }
  }
}

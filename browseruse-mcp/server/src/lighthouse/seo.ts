import type { Result as LighthouseResult } from 'lighthouse'
import type { LighthouseReport } from './types.js'
import { runLighthouseAudit } from './core.js'
import { AuditCategory } from './types.js'

// Type guard function
function isObjectWithItems(value: unknown): value is { items: unknown[] } {
  return (
    value != null
    && typeof value === 'object'
    && 'items' in value
    && Array.isArray((value as { items: unknown }).items)
  )
}

// === SEO Report Types ===

/**
 * SEO-specific report content structure
 */
export interface SEOReportContent {
  // Overall score (0-100)
  score: number
  audit_counts: {
    // Counts of different audit types
    failed: number
    passed: number
    manual: number
    informative: number
    not_applicable: number
  }
  issues: AISEOIssue[]
  categories: {
    [category: string]: {
      score: number
      issues_count: number
    }
  }
  // Ordered list of recommendations
  prioritized_recommendations?: string[]
}

/**
 * Full SEO report implementing the base LighthouseReport interface
 */
export type AIOptimizedSEOReport = LighthouseReport<SEOReportContent>

/**
 * AI-optimized SEO issue
 */
interface AISEOIssue {
  // e.g., "meta-description"
  id: string
  // e.g., "Document has a meta description"
  title: string
  impact: 'critical' | 'serious' | 'moderate' | 'minor'
  // e.g., "content", "mobile", "crawlability"
  category: string
  details?: {
    // CSS selector if applicable
    selector?: string
    // Current value
    value?: string
    // Description of the issue
    issue?: string
  }[]
  // 0-1 or null
  score: number | null
}

// This ensures we always include critical issues while limiting less important ones
const DETAIL_LIMITS = {
  // No limit for critical issues
  critical: Number.MAX_SAFE_INTEGER,
  // Up to 15 items for serious issues
  serious: 15,
  // Up to 10 items for moderate issues
  moderate: 10,
  // Up to 3 items for minor issues
  minor: 3,
}

/**
 * Runs an SEO audit on the specified URL
 * @param url The URL to audit
 * @returns Promise resolving to AI-optimized SEO audit results
 */
export async function runSEOAudit(url: string): Promise<AIOptimizedSEOReport> {
  try {
    const lhr = await runLighthouseAudit(url, [AuditCategory.SEO])
    return extractAIOptimizedData(lhr, url)
  } catch (error: unknown) {
    throw new Error(
      `SEO audit failed: ${
        error instanceof Error ? error.message : String(error)
      }`,
    )
  }
}

/**
 * Extract AI-optimized SEO data from Lighthouse results
 */
function extractAIOptimizedData(lhr: LighthouseResult, url: string): AIOptimizedSEOReport {
  const categoryData = lhr.categories[AuditCategory.SEO]
  const audits = lhr.audits != null ? lhr.audits : {}

  // Add metadata
  const metadata = {
    url,
    timestamp: lhr.fetchTime || new Date().toISOString(),
    // This could be made configurable
    device: 'desktop',
    lighthouseVersion: lhr.lighthouseVersion,
  }

  // Initialize variables
  const issues: AISEOIssue[] = []
  const categories: Record<string, { score: number, issues_count: number }> = {
    content: { score: 0, issues_count: 0 },
    mobile: { score: 0, issues_count: 0 },
    crawlability: { score: 0, issues_count: 0 },
    other: { score: 0, issues_count: 0 },
  }

  // Count audits by type
  let failedCount = 0
  let passedCount = 0
  let manualCount = 0
  let informativeCount = 0
  let notApplicableCount = 0

  // Process audit refs
  const auditRefs = categoryData?.auditRefs != null ? categoryData.auditRefs : []

  // First pass: count audits by type and initialize categories
  auditRefs.forEach(ref => {
    const audit = audits[ref.id]
    if (audit == null) {
      return
    }

    // Count by scoreDisplayMode
    if (audit.scoreDisplayMode === 'manual') {
      manualCount++
    } else if (audit.scoreDisplayMode === 'informative') {
      informativeCount++
    } else if (audit.scoreDisplayMode === 'notApplicable') {
      notApplicableCount++
    } else if (audit.score != null) {
      // Binary pass/fail
      if (audit.score >= 0.9) {
        passedCount++
      } else {
        failedCount++
      }
    }

    // Categorize the issue
    let category = 'other'
    if (
      ref.id.includes('crawl') === true
      || ref.id.includes('http') === true
      || ref.id.includes('redirect') === true
      || ref.id.includes('robots') === true
    ) {
      category = 'crawlability'
    } else if (
      ref.id.includes('viewport') === true
      || ref.id.includes('font-size') === true
      || ref.id.includes('tap-targets') === true
    ) {
      category = 'mobile'
    } else if (
      ref.id.includes('document') === true
      || ref.id.includes('meta') === true
      || ref.id.includes('description') === true
      || ref.id.includes('canonical') === true
      || ref.id.includes('title') === true
      || ref.id.includes('link') === true
    ) {
      category = 'content'
    }

    // Update category score and issues count
    if (audit.score != null && audit.score < 0.9) {
      categories[category].issues_count++
    }
  })

  // Second pass: process failed audits into AI-friendly format
  auditRefs
    .filter(ref => {
      const audit = audits[ref.id]
      return audit != null && audit.score != null && audit.score < 0.9
    })
    .sort((a, b) => (b.weight || 0) - (a.weight || 0))
    // No limit on failed audits - we'll filter dynamically based on impact
    .forEach(ref => {
      const audit = audits[ref.id]

      // Determine impact level based on score and weight
      let impact: 'critical' | 'serious' | 'moderate' | 'minor' = 'moderate'
      if (audit.score === 0) {
        impact = 'critical'
      } else if (audit.score != null && audit.score <= 0.5) {
        impact = 'serious'
      } else if (audit.score != null && audit.score > 0.7) {
        impact = 'minor'
      }

      // Categorize the issue
      let category = 'other'
      if (
        ref.id.includes('crawl') === true
        || ref.id.includes('http') === true
        || ref.id.includes('redirect') === true
        || ref.id.includes('robots') === true
      ) {
        category = 'crawlability'
      } else if (
        ref.id.includes('viewport') === true
        || ref.id.includes('font-size') === true
        || ref.id.includes('tap-targets') === true
      ) {
        category = 'mobile'
      } else if (
        ref.id.includes('document') === true
        || ref.id.includes('meta') === true
        || ref.id.includes('description') === true
        || ref.id.includes('canonical') === true
        || ref.id.includes('title') === true
        || ref.id.includes('link') === true
      ) {
        category = 'content'
      }

      // Extract details
      const details: { selector?: string, value?: string, issue?: string }[]
        = []

      if (audit.details != null) {
        const auditDetails = audit.details
        if (isObjectWithItems(auditDetails) && Array.isArray(auditDetails.items)) {
          // Determine item limit based on impact
          const itemLimit = DETAIL_LIMITS[impact]

          auditDetails.items.slice(0, itemLimit).forEach(item => {
            const detail: {
              selector?: string
              value?: string
              issue?: string
            } = {}

            // Type-safe property access for unknown item
            const itemObj = item as Record<string, unknown>

            if (itemObj.selector != null) {
              detail.selector = String(itemObj.selector)
            }

            if (itemObj.value != null) {
              detail.value = String(itemObj.value)
            }

            if (itemObj.issue != null) {
              detail.issue = String(itemObj.issue)
            }

            if (Object.keys(detail).length > 0) {
              details.push(detail)
            }
          })
        }
      }

      // Create the issue
      const issue: AISEOIssue = {
        id: ref.id,
        title: audit.title,
        impact,
        category,
        details: details.length > 0 ? details : void 0,
        score: audit.score,
      }

      issues.push(issue)
    })

  // Calculate overall score
  const score = Math.round((categoryData?.score != null ? categoryData.score : 0) * 100)

  // Generate prioritized recommendations
  const prioritized_recommendations: string[] = []

  // Add category-specific recommendations
  Object.entries(categories)
    .filter(([_, data]) => data.issues_count > 0)
    .sort(([_, a], [__, b]) => b.issues_count - a.issues_count)
    .forEach(([category, data]) => {
      if (data.issues_count === 0) {
        return
      }

      let recommendation: string

      switch (category) {
        case 'content':
          recommendation = `Improve SEO content (${data.issues_count} issues): titles, descriptions, and headers`
          break
        case 'mobile':
          recommendation = `Optimize for mobile devices (${data.issues_count} issues)`
          break
        case 'crawlability':
          recommendation = `Fix crawlability issues (${data.issues_count} issues): robots.txt, sitemaps, and redirects`
          break
        default:
          recommendation = `Fix ${data.issues_count} SEO issues in category: ${category}`
      }

      prioritized_recommendations.push(recommendation)
    })

  // Add specific high-impact recommendations
  if (issues.some(issue => issue.id === 'meta-description')) {
    prioritized_recommendations.push(
      'Add a meta description to improve click-through rate',
    )
  }

  if (issues.some(issue => issue.id === 'document-title')) {
    prioritized_recommendations.push(
      'Add a descriptive page title with keywords',
    )
  }

  if (issues.some(issue => issue.id === 'hreflang')) {
    prioritized_recommendations.push(
      'Fix hreflang implementation for international SEO',
    )
  }

  if (issues.some(issue => issue.id === 'canonical')) {
    prioritized_recommendations.push('Implement proper canonical tags')
  }

  // Create the report content
  const reportContent: SEOReportContent = {
    score,
    audit_counts: {
      failed: failedCount,
      passed: passedCount,
      manual: manualCount,
      informative: informativeCount,
      not_applicable: notApplicableCount,
    },
    issues,
    categories,
    prioritized_recommendations:
      prioritized_recommendations.length > 0
        ? prioritized_recommendations
        : void 0,
  }

  // Return the full report following the LighthouseReport interface
  return {
    metadata,
    report: reportContent,
  }
}

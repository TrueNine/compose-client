import type {Result as LighthouseResult} from 'lighthouse'
import type {LighthouseReport} from './types.js'
import {runLighthouseAudit} from './core.js'
import {AuditCategory} from './types.js'

function isObjectWithItems(value: unknown): value is {items: unknown[]} { // Type guard function
  return (
    value != null
    && typeof value === 'object'
    && 'items' in value
    && Array.isArray((value as {items: unknown}).items)
  )
}

/**
 * SEO-specific report content structure
 */
export interface SEOReportContent {
  score: number // Overall score (0-100)
  audit_counts: {
    failed: number // Counts of different audit types
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
  prioritized_recommendations?: string[] // Ordered list of recommendations
}

/**
 * Full SEO report implementing the base LighthouseReport interface
 */
export type AIOptimizedSEOReport = LighthouseReport<SEOReportContent>

/**
 * AI-optimized SEO issue
 */
interface AISEOIssue {
  id: string // e.g., "meta-description"
  title: string // e.g., "Document has a meta description"
  impact: 'critical' | 'serious' | 'moderate' | 'minor'
  category: string // e.g., "content", "mobile", "crawlability"
  details?: {
    selector?: string // CSS selector if applicable
    value?: string // Current value
    issue?: string // Description of the issue
  }[]
  score: number | null // 0-1 or null
}

const DETAIL_LIMITS = { // This ensures we always include critical issues while limiting less important ones
  critical: Number.MAX_SAFE_INTEGER, // No limit for critical issues
  serious: 15, // Up to 15 items for serious issues
  moderate: 10, // Up to 10 items for moderate issues
  minor: 3 // Up to 3 items for minor issues
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
  }
  catch (error: unknown) {
    throw new Error(
      `SEO audit failed: ${error instanceof Error ? error.message : String(error)
      }`
    )
  }
}

/**
 * Extract AI-optimized SEO data from Lighthouse results
 */
function extractAIOptimizedData(lhr: LighthouseResult, url: string): AIOptimizedSEOReport {
  const categoryData = lhr.categories[AuditCategory.SEO]
  const audits = lhr.audits ?? {}

  const metadata = {url, timestamp: lhr.fetchTime || new Date().toISOString(), // Add metadata
    device: 'desktop', lighthouseVersion: lhr.lighthouseVersion} // This could be made configurable

  const issues: AISEOIssue[] = [] // Initialize variables
  const categories: Record<string, {score: number, issues_count: number}> = {content: {score: 0, issues_count: 0}, mobile: {score: 0, issues_count: 0}, crawlability: {score: 0, issues_count: 0}, other: {score: 0, issues_count: 0}}

  let failedCount = 0 // Count audits by type
  let passedCount = 0
  let manualCount = 0
  let informativeCount = 0
  let notApplicableCount = 0

  const auditRefs = categoryData?.auditRefs ?? [] // Process audit refs

  auditRefs.forEach(ref => { // First pass: count audits by type and initialize categories
    const audit = audits[ref.id]
    if (audit == null) return

    switch (audit.scoreDisplayMode) { // Count by scoreDisplayMode
      case 'manual': manualCount++; break
      case 'informative': informativeCount++; break
      case 'notApplicable': notApplicableCount++; break
      default: {
        if (audit.score != null) {
          if (audit.score >= 0.9) passedCount++ // Binary pass/fail
          else failedCount++
        }
      }
    }

    let category = 'other' // Categorize the issue
    switch (true) {
      case ref.id.includes('crawl'):
      case ref.id.includes('http'):
      case ref.id.includes('redirect'):
      case ref.id.includes('robots'): category = 'crawlability'; break
      case ref.id.includes('viewport'):
      case ref.id.includes('font-size'):
      case ref.id.includes('tap-targets'): category = 'mobile'; break
      case ref.id.includes('document'):
      case ref.id.includes('meta'):
      case ref.id.includes('description'):
      case ref.id.includes('canonical'):
      case ref.id.includes('title'):
      case ref.id.includes('link'): category = 'content'; break
      default: break
    }

    if (audit.score != null && audit.score < 0.9) categories[category].issues_count++ // Update category score and issues count
  })

  auditRefs // Second pass: process failed audits into AI-friendly format
    .filter(ref => {
      const audit = audits[ref.id]
      return audit?.score != null && audit.score < 0.9
    })
    .sort((a, b) => (b.weight || 0) - (a.weight || 0))
    .forEach(ref => { // No limit on failed audits - we'll filter dynamically based on impact
      const audit = audits[ref.id]

      let impact: 'critical' | 'serious' | 'moderate' | 'minor' = 'moderate' // Determine impact level based on score and weight
      if (audit.score === 0) impact = 'critical'
      else if (audit.score != null && audit.score <= 0.5) impact = 'serious'
      else if (audit.score != null && audit.score > 0.7) impact = 'minor'

      let category = 'other' // Categorize the issue
      switch (true) {
        case ref.id.includes('crawl'):
        case ref.id.includes('http'):
        case ref.id.includes('redirect'):
        case ref.id.includes('robots'): category = 'crawlability'; break
        case ref.id.includes('viewport'):
        case ref.id.includes('font-size'):
        case ref.id.includes('tap-targets'): category = 'mobile'; break
        case ref.id.includes('document'):
        case ref.id.includes('meta'):
        case ref.id.includes('description'):
        case ref.id.includes('canonical'):
        case ref.id.includes('title'):
        case ref.id.includes('link'): category = 'content'; break
        default: break
      }

      const details: { // Extract details
        selector?: string
        value?: string
        issue?: string
      }[]
        = []

      if (audit.details != null) {
        const auditDetails = audit.details
        if (isObjectWithItems(auditDetails) && Array.isArray(auditDetails.items)) {
          const itemLimit = DETAIL_LIMITS[impact] // Determine item limit based on impact

          auditDetails.items.slice(0, itemLimit).forEach(item => {
            const detail: {
              selector?: string
              value?: string
              issue?: string
            } = {}

            const itemObj = item as Record<string, unknown> // Type-safe property access for unknown item

            if (itemObj.selector != null) detail.selector = String(itemObj.selector)

            if (itemObj.value != null) detail.value = String(itemObj.value)

            if (itemObj.issue != null) detail.issue = String(itemObj.issue)

            if (Object.keys(detail).length > 0) details.push(detail)
          })
        }
      }

      const issue: AISEOIssue = { // Create the issue
        id: ref.id,
        title: audit.title,
        impact,
        category,
        details: details.length > 0 ? details : void 0,
        score: audit.score
      }

      issues.push(issue)
    })

  const score = Math.round((categoryData?.score ?? 0) * 100) // Calculate overall score

  const prioritized_recommendations: string[] = [] // Generate prioritized recommendations

  Object.entries(categories) // Add category-specific recommendations
    .filter(([_, data]) => data.issues_count > 0)
    .sort(([_, a], [__, b]) => b.issues_count - a.issues_count)
    .forEach(([category, data]) => {
      if (data.issues_count === 0) return

      let recommendation: string

      switch (category) {
        case 'content': recommendation = `Improve SEO content (${data.issues_count} issues): titles, descriptions, and headers`; break
        case 'mobile': recommendation = `Optimize for mobile devices (${data.issues_count} issues)`; break
        case 'crawlability': recommendation = `Fix crawlability issues (${data.issues_count} issues): robots.txt, sitemaps, and redirects`; break
        default: recommendation = `Fix ${data.issues_count} SEO issues in category: ${category}`
      }

      prioritized_recommendations.push(recommendation)
    })

  if (issues.some(issue => issue.id === 'meta-description')) prioritized_recommendations.push('Add a meta description to improve click-through rate') // Add specific high-impact recommendations

  if (issues.some(issue => issue.id === 'document-title')) prioritized_recommendations.push('Add a descriptive page title with keywords')

  if (issues.some(issue => issue.id === 'hreflang')) prioritized_recommendations.push('Fix hreflang implementation for international SEO')

  if (issues.some(issue => issue.id === 'canonical')) prioritized_recommendations.push('Implement proper canonical tags')

  const reportContent: SEOReportContent = { // Create the report content
    score,
    audit_counts: {
      failed: failedCount,
      passed: passedCount,
      manual: manualCount,
      informative: informativeCount,
      not_applicable: notApplicableCount
    },
    issues,
    categories,
    prioritized_recommendations:
      prioritized_recommendations.length > 0
        ? prioritized_recommendations
        : void 0
  }

  return {metadata, report: reportContent} // Return the full report following the LighthouseReport interface
}

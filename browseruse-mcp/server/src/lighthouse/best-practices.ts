import type {Result as LighthouseResult} from 'lighthouse'
import type {LighthouseReport} from './types.js'
import {runLighthouseAudit} from './core.js'
import {AuditCategory} from './types.js' // === Best Practices Report Types ===

/**
 * Best Practices-specific report content structure
 */
export interface BestPracticesReportContent {
  score: number // Overall score (0-100)
  audit_counts: {
    failed: number // Counts of different audit types
    passed: number
    manual: number
    informative: number
    not_applicable: number
  }
  issues: AIBestPracticesIssue[]
  categories: {
    [category: string]: {
      score: number
      issues_count: number
    }
  }
  prioritized_recommendations?: string[] // Ordered list of recommendations
}

/**
 * Full Best Practices report implementing the base LighthouseReport interface
 */
export type AIOptimizedBestPracticesReport
  = LighthouseReport<BestPracticesReportContent>

/**
 * AI-optimized Best Practices issue
 */
interface AIBestPracticesIssue {
  id: string // e.g., "js-libraries"
  title: string // e.g., "Detected JavaScript libraries"
  impact: 'critical' | 'serious' | 'moderate' | 'minor'
  category: string // e.g., "security", "trust", "user-experience", "browser-compat"
  details?: {
    name?: string // Name of the item (e.g., library name, vulnerability)
    version?: string // Version information if applicable
    value?: string // Current value or status
    issue?: string // Description of the issue
  }[]
  score: number | null // 0-1 or null
}

interface BestPracticesAuditDetails {
  items?: Record<string, unknown>[]
  type?: string // e.g., "table"
}

const DETAIL_LIMITS: Record<string, number> = { // This ensures we always include critical issues while limiting less important ones
  critical: Number.MAX_SAFE_INTEGER, // No limit for critical issues
  serious: 15, // Up to 15 items for serious issues
  moderate: 10, // Up to 10 items for moderate issues
  minor: 3, // Up to 3 items for minor issues
}

/**
 * Runs a Best Practices audit on the specified URL
 * @param url The URL to audit
 * @returns Promise resolving to AI-optimized Best Practices audit results
 */
export async function runBestPracticesAudit(
  url: string,
): Promise<AIOptimizedBestPracticesReport> {
  try {
    const lhr = await runLighthouseAudit(url, [AuditCategory.BEST_PRACTICES])
    return extractAIOptimizedData(lhr, url)
  }
  catch (error: unknown) {
    throw new Error(
      `Best Practices audit failed: ${error instanceof Error ? error.message : String(error)
      }`,
    )
  }
}

/**
 * Extract AI-optimized Best Practices data from Lighthouse results
 */
function extractAIOptimizedData(lhr: LighthouseResult, url: string): AIOptimizedBestPracticesReport {
  const categoryData = lhr.categories[AuditCategory.BEST_PRACTICES]
  const audits = lhr.audits ?? {}

  const metadata = {url, timestamp: lhr.fetchTime || new Date().toISOString(), device: lhr.configSettings?.formFactor || 'desktop', lighthouseVersion: lhr.lighthouseVersion || 'unknown'} // Add metadata

  const issues: AIBestPracticesIssue[] = [] // Process audit results
  const categories: Record<string, {score: number, issues_count: number}> = {
    'security': {score: 0, issues_count: 0},
    'trust': {score: 0, issues_count: 0},
    'user-experience': {score: 0, issues_count: 0},
    'browser-compat': {score: 0, issues_count: 0},
    'other': {score: 0, issues_count: 0},
  }

  let failedCount = 0 // Counters for audit types
  let passedCount = 0
  let manualCount = 0
  let informativeCount = 0
  let notApplicableCount = 0

  const failedAudits = Object.entries(audits) // Process failed audits (score < 1)
    .filter(([, audit]) => {
      const {score} = audit
      return (
        score !== null
        && score < 1
        && audit.scoreDisplayMode !== 'manual'
        && audit.scoreDisplayMode !== 'notApplicable'
      )
    })
    .map(([auditId, audit]) => ({auditId, ...audit}))

  Object.values(audits).forEach(audit => { // Update counters
    const {score, scoreDisplayMode} = audit

    switch (scoreDisplayMode) {
      case 'manual': manualCount++; break
      case 'informative': informativeCount++; break
      case 'notApplicable': notApplicableCount++; break
      default: {
        if (score === 1) passedCount++
        else if (score !== null && score < 1) failedCount++
      }
    }
  })

  failedAudits.forEach((ref: Record<string, unknown>) => { // Process failed audits into AI-friendly format
    let impact: 'critical' | 'serious' | 'moderate' | 'minor' // Determine impact level based on audit score and weight
    const score = typeof ref.score === 'number' ? ref.score : 0

    if (score === 0) impact = 'critical' // Use a more reliable approach to determine impact
    else if (score < 0.5) impact = 'serious'
    else if (score < 0.9) impact = 'moderate'
    else impact = 'minor'

    let category = 'other' // Categorize the issue

    if ( // Security-related issues
      String(ref.auditId).includes('csp')
      || String(ref.auditId).includes('security')
      || String(ref.auditId).includes('vulnerab')
      || String(ref.auditId).includes('password')
      || String(ref.auditId).includes('cert')
      || String(ref.auditId).includes('deprecat')
    ) {
      category = 'security'
    } else if ( // Trust and legitimacy issues
      String(ref.auditId).includes('doctype')
      || String(ref.auditId).includes('charset')
      || String(ref.auditId).includes('legit')
      || String(ref.auditId).includes('trust')
    ) {
      category = 'trust'
    } else if ( // User experience issues
      String(ref.auditId).includes('user')
      || String(ref.auditId).includes('experience')
      || String(ref.auditId).includes('console')
      || String(ref.auditId).includes('errors')
      || String(ref.auditId).includes('paste')
    ) {
      category = 'user-experience'
    } else if ( // Browser compatibility issues
      String(ref.auditId).includes('compat')
      || String(ref.auditId).includes('browser')
      || String(ref.auditId).includes('vendor')
      || String(ref.auditId).includes('js-lib')
    ) {
      category = 'browser-compat'
    }

    categories[category].issues_count++ // Count issues by category

    const issue: AIBestPracticesIssue = { // Create issue object
      id: String(ref.auditId),
      title: String(ref.title),
      impact,
      category,
      score: typeof ref.score === 'number' ? ref.score : null,
      details: [],
    }

    const refDetails = ref.details as BestPracticesAuditDetails | undefined // Extract details if available
    if (refDetails?.items && Array.isArray(refDetails.items)) {
      const itemLimit = DETAIL_LIMITS[impact]
      const detailItems = refDetails.items.slice(0, itemLimit)

      detailItems.forEach((item: Record<string, unknown>) => {
        issue.details ??= []

        const detail: Record<string, string> = {} // Different audits have different detail structures

        if (typeof item.name === 'string') detail.name = item.name
        if (typeof item.version === 'string') detail.version = item.version
        if (typeof item.issue === 'string') detail.issue = item.issue
        if (item.value !== void 0) detail.value = String(item.value)

        if ( // For JS libraries, extract name and version
          String(ref.auditId) === 'js-libraries'
          && typeof item.name === 'string'
          && typeof item.version === 'string'
        ) {
          detail.name = item.name
          detail.version = item.version
        }

        for (const [key, value] of Object.entries(item)) { // Add other generic properties that might exist
          if (!detail[key] && typeof value === 'string') detail[key] = value
        }

        issue.details.push(detail)
      })
    }

    issues.push(issue)
  })

  Object.keys(categories).forEach(category => { // Calculate category scores (0-100)
    const issueCount = categories[category].issues_count // Simplified scoring: if there are issues in this category, score is reduced proportionally
    if (issueCount > 0) {
      const penalty = Math.min(100, issueCount * 25) // More issues = lower score, max penalty of 25 points per issue
      categories[category].score = Math.max(0, 100 - penalty)
    } else categories[category].score = 100
  })

  const prioritized_recommendations: string[] = [] // Generate prioritized recommendations

  Object.entries(categories) // Prioritize recommendations by category with most issues
    .filter(([_, data]) => data.issues_count > 0)
    .sort(([_, a], [__, b]) => b.issues_count - a.issues_count)
    .forEach(([category, data]) => {
      let recommendation: string

      switch (category) {
        case 'security': recommendation = `Address ${data.issues_count} security issues: vulnerabilities, CSP, deprecations`; break
        case 'trust': recommendation = `Fix ${data.issues_count} trust & legitimacy issues: doctype, charset`; break
        case 'user-experience': recommendation = `Improve ${data.issues_count} user experience issues: console errors, user interactions`; break
        case 'browser-compat': recommendation = `Resolve ${data.issues_count} browser compatibility issues: outdated libraries, vendor prefixes`; break
        default: recommendation = `Fix ${data.issues_count} other best practice issues`
      }

      prioritized_recommendations.push(recommendation)
    })

  return {metadata, report: { // Return the optimized report
    score: categoryData?.score != null ? Math.round(categoryData.score * 100) : 0,
    audit_counts: {
      failed: failedCount,
      passed: passedCount,
      manual: manualCount,
      informative: informativeCount,
      not_applicable: notApplicableCount,
    },
    issues,
    categories,
    prioritized_recommendations,
  }}
}

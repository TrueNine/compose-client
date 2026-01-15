import type {Result as LighthouseResult} from 'lighthouse'
import type {LighthouseReport} from './types.js'
import {runLighthouseAudit} from './core.js'
import {AuditCategory} from './types.js' // === Accessibility Report Types ===

/**
 * Accessibility-specific report content structure
 */
export interface AccessibilityReportContent {
  score: number
  audit_counts: {
    failed: number // Counts of different audit types
    passed: number
    manual: number
    informative: number
    not_applicable: number
  }
  issues: AIAccessibilityIssue[]
  categories: {
    [category: string]: {
      score: number
      issues_count: number
    }
  }
  critical_elements: AIAccessibilityElement[]
  prioritized_recommendations?: string[]
}

/**
 * Full accessibility report implementing the base LighthouseReport interface
 */
export type AIOptimizedAccessibilityReport
  = LighthouseReport<AccessibilityReportContent>

/**
 * AI-optimized accessibility issue
 */
interface AIAccessibilityIssue {
  id: string
  title: string
  impact: 'critical' | 'serious' | 'moderate' | 'minor'
  category: string
  elements?: AIAccessibilityElement[]
  score: number | null
}

/**
 * Accessibility element with issues
 */
interface AIAccessibilityElement {
  selector: string // CSS selector
  snippet?: string // HTML snippet
  label?: string // Element label
  issue_description?: string // Description of the issue
  value?: string | number // Current value (e.g., contrast ratio)
} // AuditDetails interface removed - handled directly with type guards in processing logic // but are not needed for the AI-optimized format // These interfaces were part of the original Lighthouse audit structure // Original interfaces for backward compatibility - now removed as they're unused

const DETAIL_LIMITS = { // This ensures we always include critical issues while limiting less important ones // Original limits were optimized for human consumption
  critical: Number.MAX_SAFE_INTEGER, // No limit for critical issues
  serious: 15, // Up to 15 items for serious issues
  moderate: 10, // Up to 10 items for moderate issues
  minor: 3, // Up to 3 items for minor issues
}

/**
 * Runs an accessibility audit on the specified URL
 * @param url The URL to audit
 * @returns Promise resolving to AI-optimized accessibility audit results
 */
export async function runAccessibilityAudit(
  url: string,
): Promise<AIOptimizedAccessibilityReport> {
  try {
    const lhr = await runLighthouseAudit(url, [AuditCategory.ACCESSIBILITY])
    return extractAIOptimizedData(lhr, url)
  }
  catch (error: unknown) {
    throw new Error(
      `Accessibility audit failed: ${
        error instanceof Error ? error.message : String(error)
      }`,
    )
  }
}

/**
 * Extract AI-optimized accessibility data from Lighthouse results
 */
function extractAIOptimizedData(lhr: LighthouseResult, url: string): AIOptimizedAccessibilityReport {
  const categoryData = lhr.categories[AuditCategory.ACCESSIBILITY]
  const audits = lhr.audits ?? {}

  const metadata = {url, timestamp: lhr.fetchTime || new Date().toISOString(), device: 'desktop', lighthouseVersion: lhr.lighthouseVersion} // Add metadata

  const issues: AIAccessibilityIssue[] = [] // Initialize variables
  const criticalElements: AIAccessibilityElement[] = []
  const categories: Record<string, {score: number, issues_count: number}> = {}

  let failedCount = 0 // Count audits by type
  let passedCount = 0
  let manualCount = 0
  let informativeCount = 0
  let notApplicableCount = 0

  const auditRefs = categoryData?.auditRefs ?? [] // Process audit refs

  auditRefs.forEach(ref => { // First pass: count audits by type and initialize categories
    const audit = audits[ref.id]
    switch (audit.scoreDisplayMode) { // Count by scoreDisplayMode
      case 'manual': manualCount++; break
      case 'informative': informativeCount++; break
      case 'notApplicable': notApplicableCount++; break
      default: if (audit.score !== null) {
        if (audit.score >= 0.9) passedCount++ // Binary pass/fail
        else failedCount++
      }
    }

    if (ref.group === void 0) return
    if (!(ref.group in categories)) categories[ref.group] = {score: 0, issues_count: 0} // Initialize category if not exists

    if (audit.score !== null && audit.score < 0.9) categories[ref.group].issues_count++ // Update category score and issues count
  })

  auditRefs // Second pass: process failed audits into AI-friendly format
    .filter(ref => {
      const audit = audits[ref.id]
      return audit.score !== null && audit.score < 0.9
    })
    .sort((a, b) => (b.weight || 0) - (a.weight || 0))
    .forEach(ref => { // No limit on number of failed audits - we'll show them all
      const audit = audits[ref.id]

      let impact: 'critical' | 'serious' | 'moderate' | 'minor' = 'moderate' // Determine impact level based on score and weight
      if (audit.score === 0) impact = 'critical'
      else if (audit.score !== null && audit.score <= 0.5) impact = 'serious'
      else if (audit.score !== null && audit.score > 0.7) impact = 'minor'

      const elements: AIAccessibilityElement[] = [] // Create elements array

      if (audit.details) {
        const details = audit.details as unknown
        if ( // Type guard to check if details has items property
          details != null
          && typeof details === 'object'
          && 'items' in details
          && Array.isArray((details as {items: unknown[]}).items)
        ) {
          const detailsWithItems = details as {items: unknown[]}
          const {items} = detailsWithItems
          const itemLimit = DETAIL_LIMITS[impact] // Apply limits based on impact level
          items.slice(0, itemLimit).forEach(item => {
            const itemObj = item as Record<string, unknown>
            const node = itemObj.node as Record<string, unknown> | undefined

            if (!node) return

            const element: AIAccessibilityElement = {selector: String(node.selector), snippet: node.snippet != null ? String(node.snippet) : void 0, label: node.nodeLabel != null ? String(node.nodeLabel) : void 0, issue_description: node.explanation != null ? String(node.explanation) : itemObj.explanation != null ? String(itemObj.explanation) : void 0}
            if (itemObj.value != null) {
              element.value = typeof itemObj.value === 'string' || typeof itemObj.value === 'number'
                ? itemObj.value
                : String(itemObj.value)
            }
            elements.push(element)
            if (impact === 'critical' || impact === 'serious') criticalElements.push(element)
          })
        }
      }

      const issue: AIAccessibilityIssue = { // Create the issue
        id: ref.id,
        title: audit.title,
        impact,
        category: ref.group ?? 'other',
        elements: elements.length > 0 ? elements : void 0,
        score: audit.score,
      }

      issues.push(issue)
    })

  const score = Math.round((categoryData?.score ?? 0) * 100) // Calculate overall score

  const prioritized_recommendations: string[] = [] // Generate prioritized recommendations

  Object.entries(categories) // Add category-specific recommendations
    .filter(([_, data]) => data.issues_count > 0)
    .sort(([_, a], [__, b]) => b.issues_count - a.issues_count)
    .forEach(([category, data]) => {
      let recommendation = ''

      switch (category) {
        case 'a11y-color-contrast': recommendation = 'Improve color contrast for better readability'; break
        case 'a11y-names-labels': recommendation = 'Add proper labels to all interactive elements'; break
        case 'a11y-aria': recommendation = 'Fix ARIA attributes and roles'; break
        case 'a11y-navigation': recommendation = 'Improve keyboard navigation and focus management'; break
        case 'a11y-language': recommendation = 'Add proper language attributes to HTML'; break
        case 'a11y-tables-lists': recommendation = 'Fix table and list structures for screen readers'; break
        default: recommendation = `Fix ${data.issues_count} issues in ${category}`
      }

      prioritized_recommendations.push(recommendation)
    })

  if (issues.some(issue => issue.id === 'color-contrast')) prioritized_recommendations.push('Fix low contrast text for better readability') // Add specific high-impact recommendations

  if (issues.some(issue => issue.id === 'document-title')) prioritized_recommendations.push('Add a descriptive page title')

  if (issues.some(issue => issue.id === 'image-alt')) prioritized_recommendations.push('Add alt text to all images')

  const reportContent: AccessibilityReportContent = { // Create the report content
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
    critical_elements: criticalElements,
    prioritized_recommendations:
      prioritized_recommendations.length > 0
        ? prioritized_recommendations
        : void 0,
  }

  return {metadata, report: reportContent} // Return the full report following the LighthouseReport interface
}

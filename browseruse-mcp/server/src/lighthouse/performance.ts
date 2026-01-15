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
} // === Performance Report Types ===

/**
 * Performance-specific report content structure
 */
export interface PerformanceReportContent {
  score: number // Overall score (0-100)
  audit_counts: {
    failed: number // Counts of different audit types
    passed: number
    manual: number
    informative: number
    not_applicable: number
  }
  metrics: AIOptimizedMetric[]
  opportunities: AIOptimizedOpportunity[]
  page_stats?: AIPageStats // Optional page statistics
  prioritized_recommendations?: string[] // Ordered list of recommendations
}

/**
 * Full performance report implementing the base LighthouseReport interface
 */
export type AIOptimizedPerformanceReport
  = LighthouseReport<PerformanceReportContent>

interface AIOptimizedMetric { // AI-optimized performance metric format
  id: string // Short ID like "lcp", "fcp"
  score: number | null // 0-1 score
  value_ms: number // Value in milliseconds
  element_type?: string // For LCP: "image", "text", etc.
  element_selector?: string // DOM selector for the element
  element_url?: string // For images/videos
  element_content?: string // For text content (truncated)
  passes_core_web_vital?: boolean // Whether this metric passes as a Core Web Vital
}

interface AIOptimizedOpportunity { // AI-optimized opportunity format
  id: string // Like "render_blocking", "http2"
  savings_ms: number // Time savings in ms
  severity?: 'critical' | 'serious' | 'moderate' | 'minor' // Severity classification
  resources: {
    url: string // Resource URL
    savings_ms?: number // Individual resource savings
    size_kb?: number // Size in KB
    type?: string // Resource type (js, css, img, etc.)
    is_third_party?: boolean // Whether this is a third-party resource
  }[]
}

interface AIPageStats { // Page stats for AI analysis
  total_size_kb: number // Total page weight in KB
  total_requests: number // Total number of requests
  resource_counts: {
    js: number // Count by resource type
    css: number
    img: number
    font: number
    other: number
  }
  third_party_size_kb: number // Size of third-party resources
  main_thread_blocking_time_ms: number // Time spent blocking the main thread
}

const DETAIL_LIMITS = { // This ensures we always include critical issues while limiting less important ones
  critical: Number.MAX_SAFE_INTEGER, // No limit for critical issues
  serious: 15, // Up to 15 items for serious issues
  moderate: 10, // Up to 10 items for moderate issues
  minor: 3, // Up to 3 items for minor issues
}

/**
 * Performance audit adapted for AI consumption
 * This format is optimized for AI agents with:
 * - Concise, relevant information without redundant descriptions
 * - Key metrics and opportunities clearly structured
 * - Only actionable data that an AI can use for recommendations
 */
export async function runPerformanceAudit(
  url: string,
): Promise<AIOptimizedPerformanceReport> {
  try {
    const lhr = await runLighthouseAudit(url, [AuditCategory.PERFORMANCE])
    return extractAIOptimizedData(lhr, url)
  }
  catch (error: unknown) {
    throw new Error(
      `Performance audit failed: ${error instanceof Error ? error.message : String(error)
      }`,
    )
  }
}

/**
 * Extract AI-optimized performance data from Lighthouse results
 */
function extractAIOptimizedData(lhr: LighthouseResult, url: string): AIOptimizedPerformanceReport {
  const audits = lhr.audits ?? {}
  const categoryData = lhr.categories[AuditCategory.PERFORMANCE]
  const score = Math.round((categoryData?.score ?? 0) * 100)

  const metadata = {url, timestamp: lhr.fetchTime || new Date().toISOString(), // Add metadata
    device: 'desktop', lighthouseVersion: lhr.lighthouseVersion} // This could be made configurable

  const auditRefs = categoryData?.auditRefs ?? [] // Count audits by type
  let failedCount = 0
  let passedCount = 0
  let manualCount = 0
  let informativeCount = 0
  let notApplicableCount = 0

  auditRefs.forEach(ref => {
    const audit = audits[ref.id]
    if (audit == null) return

    switch (audit.scoreDisplayMode) {
      case 'manual': manualCount++; break
      case 'informative': informativeCount++; break
      case 'notApplicable': notApplicableCount++; break
      default: {
        if (audit.score != null) {
          if (audit.score >= 0.9) passedCount++
          else failedCount++
        }
      }
    }
  })

  const audit_counts = {
    failed: failedCount,
    passed: passedCount,
    manual: manualCount,
    informative: informativeCount,
    not_applicable: notApplicableCount,
  }

  const metrics: AIOptimizedMetric[] = []
  const opportunities: AIOptimizedOpportunity[] = []

  if (audits['largest-contentful-paint'] != null) { // Extract core metrics
    const lcp = audits['largest-contentful-paint']
    const lcpElement = audits['largest-contentful-paint-element']

    const metric: AIOptimizedMetric = {id: 'lcp', score: lcp.score, value_ms: Math.round(lcp.numericValue ?? 0), passes_core_web_vital: lcp.score != null && lcp.score >= 0.9} // Enhanced LCP element detection

    if (lcpElement?.details != null) { // 1. Try from largest-contentful-paint-element audit
      const lcpDetails = lcpElement.details as unknown

      if ( // First attempt - try to get directly from items
        isObjectWithItems(lcpDetails)
        && lcpDetails.items.length > 0
      ) {
        const itemData = lcpDetails.items[0] as Record<string, unknown> // For text elements in tables format
        if (itemData.type === 'table' && itemData.items != null && Array.isArray(itemData.items) && itemData.items.length > 0) {
          const firstTableItem = itemData.items[0] as Record<string, unknown>

          if (firstTableItem.node != null) {
            const node = firstTableItem.node as Record<string, unknown>

            if (node.selector != null) metric.element_selector = String(node.selector)

            const {path} = node // Determine element type based on path or selector
            const selector = node.selector != null ? String(node.selector) : ''

            if (path != null) {
              if (selector.includes(' > img') || selector.includes(' img') || selector.endsWith('img') || String(path).includes(',IMG')) {
                metric.element_type = 'image'

                const imgMatch = /img\.[^> ]+/.exec(selector) // Try to extract image name from selector
                if (imgMatch != null && metric.element_url == null) metric.element_url = imgMatch[0]
              } else if (String(path).includes(',SPAN') || String(path).includes(',P') || String(path).includes(',H')) metric.element_type = 'text'
            }

            if (node.nodeLabel != null) { // Try to extract text content if available
              metric.element_content = String(node.nodeLabel).slice(
                0,
                100,
              )
            }
          }
        } else if (itemData.node != null) { // Original handling for direct items
          const node = itemData.node as Record<string, unknown>

          if (node.nodeLabel != null) {
            if (String(node.nodeLabel).startsWith('<img')) { // Determine element type from node label
              metric.element_type = 'image'
              const {snippet} = node // Try to extract image URL from the node snippet
              if (snippet != null) {
                const match = /src="([^"]+)"/.exec(String(snippet))
                if (match?.[1] != null) metric.element_url = match[1]
              }
            } else if (String(node.nodeLabel).startsWith('<video')) metric.element_type = 'video'
            else if (String(node.nodeLabel).startsWith('<h')) metric.element_type = 'heading'
            else metric.element_type = 'text'

            if (node.selector != null) metric.element_selector = String(node.selector)
          }
        }
      }
    }

    const lcpImageAudit = audits['lcp-lazy-loaded'] // 2. Try from lcp-lazy-loaded audit
    if (lcpImageAudit?.details != null) {
      const lcpImageDetails = lcpImageAudit.details as unknown

      if (
        isObjectWithItems(lcpImageDetails)
        && lcpImageDetails.items.length > 0
      ) {
        const item = lcpImageDetails.items[0] as Record<string, unknown>

        if (item.url != null) {
          metric.element_type = 'image'
          metric.element_url = String(item.url)
        }
      }
    }

    if (metric.element_url == null && lcp.details != null) { // 3. Try directly from the LCP audit details
      const lcpDirectDetails = lcp.details as unknown

      if (isObjectWithItems(lcpDirectDetails)) {
        for (const item of lcpDirectDetails.items) {
          const itemObj = item as Record<string, unknown>
          if (itemObj.url != null || (itemObj.node != null && typeof itemObj.node === 'object' && (itemObj.node as Record<string, unknown>).path != null)) {
            if (itemObj.url != null) {
              metric.element_url = String(itemObj.url)
              metric.element_type = /\.(?:jpg|jpeg|png|gif|webp|svg)$/i.exec(String(itemObj.url)) != null
                ? 'image'
                : 'resource'
            }
            if (itemObj.node != null && typeof itemObj.node === 'object') {
              const nodeObj = itemObj.node as Record<string, unknown>
              if (nodeObj.selector != null) metric.element_selector = String(nodeObj.selector)
            }
            break
          }
        }
      }
    }

    const largestImageAudit = audits['largest-image-paint'] // 4. Check for specific audit that might contain image info
    if (largestImageAudit?.details != null) {
      const imageDetails = largestImageAudit.details as unknown

      if (
        isObjectWithItems(imageDetails)
        && imageDetails.items.length > 0
      ) {
        const item = imageDetails.items[0] as Record<string, unknown>

        if (item.url != null) {
          metric.element_type = 'image' // If we have a large image that's close in time to LCP, it's likely the LCP element
          metric.element_url = String(item.url)
        }
      }
    }

    if (metric.element_url == null) { // 5. Check for network requests audit to find image resources
      const networkRequests = audits['network-requests']

      if (networkRequests?.details != null) {
        const networkDetails = networkRequests.details as unknown

        if (isObjectWithItems(networkDetails)) {
          const lcpTime = lcp.numericValue ?? 0 // Get all image resources loaded close to the LCP time
          const imageResources = networkDetails.items
            .filter(
              (item: unknown) => {
                const itemObj = item as Record<string, unknown>
                return itemObj.url != null
                  && itemObj.mimeType != null
                  && String(itemObj.mimeType).startsWith('image/')
                  && itemObj.endTime != null
                  && Math.abs(Number(itemObj.endTime) - lcpTime) < 500 // Within 500ms of LCP
              },
            )
            .sort(
              (a: unknown, b: unknown) => {
                const aObj = a as Record<string, unknown>
                const bObj = b as Record<string, unknown>
                return Math.abs(Number(aObj.endTime) - lcpTime) - Math.abs(Number(bObj.endTime) - lcpTime)
              },
            )

          if (imageResources.length > 0) {
            const closestImage = imageResources[0] as Record<string, unknown>

            if (metric.element_type == null) {
              metric.element_type = 'image'
              metric.element_url = String(closestImage.url)
            }
          }
        }
      }
    }

    metrics.push(metric)
  }

  if (audits['first-contentful-paint'] != null) {
    const fcp = audits['first-contentful-paint']
    metrics.push({id: 'fcp', score: fcp.score, value_ms: Math.round(fcp.numericValue ?? 0), passes_core_web_vital: (fcp.score ?? 0) >= 0.9})
  }

  if (audits['speed-index'] != null) {
    const si = audits['speed-index']
    metrics.push({id: 'si', score: si.score, value_ms: Math.round(si.numericValue ?? 0)})
  }

  if (audits.interactive != null) {
    const tti = audits.interactive
    metrics.push({id: 'tti', score: tti.score, value_ms: Math.round(tti.numericValue ?? 0)})
  }

  if (audits['cumulative-layout-shift'] != null) { // Add CLS (Cumulative Layout Shift)
    const cls = audits['cumulative-layout-shift']
    metrics.push({id: 'cls', score: cls.score, value_ms: Math.round((cls.numericValue ?? 0) * 1000) / 1000, passes_core_web_vital: (cls.score ?? 0) >= 0.9}) // Convert to 3 decimal places // CLS is not in ms, but a unitless value
  }

  if (audits['total-blocking-time'] != null) { // Add TBT (Total Blocking Time)
    const tbt = audits['total-blocking-time']
    metrics.push({id: 'tbt', score: tbt.score, value_ms: Math.round(tbt.numericValue ?? 0), passes_core_web_vital: (tbt.score ?? 0) >= 0.9})
  }

  if (audits['render-blocking-resources'] != null) { // Extract opportunities
    const rbrAudit = audits['render-blocking-resources']

    let impact: 'critical' | 'serious' | 'moderate' | 'minor' = 'moderate' // Determine impact level based on potential savings
    const savings = Math.round(rbrAudit.numericValue ?? 0)

    if (savings > 2000) impact = 'critical'
    else if (savings > 1000) impact = 'serious'
    else if (savings < 300) impact = 'minor'

    const opportunity: AIOptimizedOpportunity = {id: 'render_blocking_resources', savings_ms: savings, severity: impact, resources: []}

    const rbrDetails = rbrAudit.details as unknown
    if (rbrDetails != null && isObjectWithItems(rbrDetails)) {
      const itemLimit = DETAIL_LIMITS[impact] // Determine how many items to include based on impact

      rbrDetails.items
        .slice(0, itemLimit)
        .forEach((item: unknown) => {
          const itemObj = item as Record<string, unknown>
          if (itemObj.url == null) return

          const url = String(itemObj.url)
          const fileName = url.split('/').pop() ?? url
          opportunity.resources.push({url: fileName, savings_ms: Math.round(itemObj.wastedMs != null ? Number(itemObj.wastedMs) : 0)})
        })
    }

    if (opportunity.resources.length > 0) opportunities.push(opportunity)
  }

  if (audits['uses-http2'] != null) {
    const http2Audit = audits['uses-http2']

    let impact: 'critical' | 'serious' | 'moderate' | 'minor' = 'moderate' // Determine impact level based on potential savings
    const savings = Math.round(http2Audit.numericValue ?? 0)

    if (savings > 2000) impact = 'critical'
    else if (savings > 1000) impact = 'serious'
    else if (savings < 300) impact = 'minor'

    const opportunity: AIOptimizedOpportunity = {id: 'http2', savings_ms: savings, severity: impact, resources: []}

    const http2Details = http2Audit.details as unknown
    if (http2Details != null && isObjectWithItems(http2Details)) {
      const itemLimit = DETAIL_LIMITS[impact] // Determine how many items to include based on impact

      http2Details.items
        .slice(0, itemLimit)
        .forEach((item: unknown) => {
          const itemObj = item as Record<string, unknown>
          if (itemObj.url == null) return

          const url = String(itemObj.url)
          const fileName = url.split('/').pop() ?? url
          opportunity.resources.push({url: fileName})
        })
    }

    if (opportunity.resources.length > 0) opportunities.push(opportunity)
  }

  let page_stats: AIPageStats | undefined // Extract page stats // After extracting all metrics and opportunities, collect page stats

  const networkRequests = audits['network-requests'] // Total page stats
  const thirdPartyAudit = audits['third-party-summary']
  const mainThreadWork = audits['mainthread-work-breakdown']

  if (networkRequests?.details) {
    const resourceDetails = networkRequests.details as unknown

    if (isObjectWithItems(resourceDetails)) {
      const resources = resourceDetails.items
      const totalRequests = resources.length

      let totalSizeKb = 0 // Calculate total size and counts by type
      let jsCount = 0
      let cssCount = 0
      let imgCount = 0
      let fontCount = 0
      let otherCount = 0

      resources.forEach((resource: unknown) => {
        const resourceObj = resource as Record<string, unknown>
        const sizeKb = resourceObj.transferSize != null
          ? Math.round(Number(resourceObj.transferSize) / 1024)
          : 0
        totalSizeKb += sizeKb

        const mimeType = resourceObj.mimeType != null ? String(resourceObj.mimeType) : '' // Count by mime type
        const url = resourceObj.url != null ? String(resourceObj.url) : ''
        if (mimeType.includes('javascript') || url.endsWith('.js')) jsCount++
        else if (mimeType.includes('css') || url.endsWith('.css')) cssCount++
        else if (mimeType.includes('image') || /\.(?:jpg|jpeg|png|gif|webp|svg)$/i.test(url)) imgCount++
        else if (mimeType.includes('font') || /\.(?:woff|woff2|ttf|otf|eot)$/i.test(url)) fontCount++
        else otherCount++
      })

      let thirdPartySizeKb = 0 // Calculate third-party size
      if (thirdPartyAudit?.details) {
        const thirdPartyDetails = thirdPartyAudit.details as unknown
        if (isObjectWithItems(thirdPartyDetails)) {
          thirdPartyDetails.items.forEach((item: unknown) => {
            const itemObj = item as Record<string, unknown>
            if (itemObj.transferSize != null) thirdPartySizeKb += Math.round(Number(itemObj.transferSize) / 1024)
          })
        }
      }

      let mainThreadBlockingTimeMs = 0 // Get main thread blocking time
      if (mainThreadWork?.numericValue != null && mainThreadWork.numericValue !== 0) mainThreadBlockingTimeMs = Math.round(mainThreadWork.numericValue)

      page_stats = { // Create page stats object
        total_size_kb: totalSizeKb,
        total_requests: totalRequests,
        resource_counts: {
          js: jsCount,
          css: cssCount,
          img: imgCount,
          font: fontCount,
          other: otherCount,
        },
        third_party_size_kb: thirdPartySizeKb,
        main_thread_blocking_time_ms: mainThreadBlockingTimeMs,
      }
    }
  }

  const prioritized_recommendations: string[] = [] // Generate prioritized recommendations

  if (audits['render-blocking-resources']?.score === 0) prioritized_recommendations.push('Eliminate render-blocking resources') // Add key recommendations based on failed audits with high impact

  if (audits['uses-responsive-images']?.score === 0) prioritized_recommendations.push('Properly size images')

  if (audits['uses-optimized-images']?.score === 0) prioritized_recommendations.push('Efficiently encode images')

  if (audits['uses-text-compression']?.score === 0) prioritized_recommendations.push('Enable text compression')

  if (audits['uses-http2']?.score === 0) prioritized_recommendations.push('Use HTTP/2')

  if (audits['largest-contentful-paint'] != null && (audits['largest-contentful-paint'].score ?? 1) < 0.5) { // Add more specific recommendations based on Core Web Vitals
    prioritized_recommendations.push('Improve Largest Contentful Paint (LCP)')
  }

  if (audits['cumulative-layout-shift'] != null && (audits['cumulative-layout-shift'].score ?? 1) < 0.5) {
    prioritized_recommendations.push('Reduce layout shifts (CLS)')
  }

  if (audits['total-blocking-time'] != null && (audits['total-blocking-time'].score ?? 1) < 0.5) {
    prioritized_recommendations.push('Reduce JavaScript execution time')
  }

  const reportContent: PerformanceReportContent = { // Create the performance report content
    score,
    audit_counts,
    metrics,
    opportunities,
    page_stats,
    prioritized_recommendations:
      prioritized_recommendations.length > 0
        ? prioritized_recommendations
        : void 0,
  }

  return {metadata, report: reportContent} // Return the full report following the LighthouseReport interface
}

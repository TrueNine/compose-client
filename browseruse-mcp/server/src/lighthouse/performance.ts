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

// === Performance Report Types ===

/**
 * Performance-specific report content structure
 */
export interface PerformanceReportContent {
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
  metrics: AIOptimizedMetric[]
  opportunities: AIOptimizedOpportunity[]
  // Optional page statistics
  page_stats?: AIPageStats
  // Ordered list of recommendations
  prioritized_recommendations?: string[]
}

/**
 * Full performance report implementing the base LighthouseReport interface
 */
export type AIOptimizedPerformanceReport
  = LighthouseReport<PerformanceReportContent>

// AI-optimized performance metric format
interface AIOptimizedMetric {
  // Short ID like "lcp", "fcp"
  id: string
  // 0-1 score
  score: number | null
  // Value in milliseconds
  value_ms: number
  // For LCP: "image", "text", etc.
  element_type?: string
  // DOM selector for the element
  element_selector?: string
  // For images/videos
  element_url?: string
  // For text content (truncated)
  element_content?: string
  // Whether this metric passes as a Core Web Vital
  passes_core_web_vital?: boolean
}

// AI-optimized opportunity format
interface AIOptimizedOpportunity {
  // Like "render_blocking", "http2"
  id: string
  // Time savings in ms
  savings_ms: number
  // Severity classification
  severity?: 'critical' | 'serious' | 'moderate' | 'minor'
  resources: Array<{
    // Resource URL
    url: string
    // Individual resource savings
    savings_ms?: number
    // Size in KB
    size_kb?: number
    // Resource type (js, css, img, etc.)
    type?: string
    // Whether this is a third-party resource
    is_third_party?: boolean
  }>
}

// Page stats for AI analysis
interface AIPageStats {
  // Total page weight in KB
  total_size_kb: number
  // Total number of requests
  total_requests: number
  resource_counts: {
    // Count by resource type
    js: number
    css: number
    img: number
    font: number
    other: number
  }
  // Size of third-party resources
  third_party_size_kb: number
  // Time spent blocking the main thread
  main_thread_blocking_time_ms: number
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
  } catch (error: unknown) {
    throw new Error(
      `Performance audit failed: ${
        error instanceof Error ? error.message : String(error)
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

  // Add metadata
  const metadata = {
    url,
    timestamp: lhr.fetchTime || new Date().toISOString(),
    // This could be made configurable
    device: 'desktop',
    lighthouseVersion: lhr.lighthouseVersion,
  }

  // Count audits by type
  const auditRefs = categoryData?.auditRefs ?? []
  let failedCount = 0
  let passedCount = 0
  let manualCount = 0
  let informativeCount = 0
  let notApplicableCount = 0

  auditRefs.forEach(ref => {
    const audit = audits[ref.id]
    if (audit == null) {
      return
    }

    if (audit.scoreDisplayMode === 'manual') {
      manualCount++
    } else if (audit.scoreDisplayMode === 'informative') {
      informativeCount++
    } else if (audit.scoreDisplayMode === 'notApplicable') {
      notApplicableCount++
    } else if (audit.score != null) {
      if (audit.score >= 0.9) {
        passedCount++
      } else {
        failedCount++
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

  // Extract core metrics
  if (audits['largest-contentful-paint'] != null) {
    const lcp = audits['largest-contentful-paint']
    const lcpElement = audits['largest-contentful-paint-element']

    const metric: AIOptimizedMetric = {
      id: 'lcp',
      score: lcp.score,
      value_ms: Math.round(lcp.numericValue ?? 0),
      passes_core_web_vital: lcp.score != null && lcp.score >= 0.9,
    }

    // Enhanced LCP element detection

    // 1. Try from largest-contentful-paint-element audit
    if (lcpElement != null && lcpElement.details != null) {
      const lcpDetails = lcpElement.details as unknown

      // First attempt - try to get directly from items
      if (
        isObjectWithItems(lcpDetails)
        && lcpDetails.items.length > 0
      ) {
        // For text elements in tables format
        const itemData = lcpDetails.items[0] as Record<string, unknown>
        if (itemData.type === 'table' && itemData.items != null && Array.isArray(itemData.items) && itemData.items.length > 0) {
          const firstTableItem = itemData.items[0] as Record<string, unknown>

          if (firstTableItem.node != null) {
            const node = firstTableItem.node as Record<string, unknown>

            if (node.selector != null) {
              metric.element_selector = String(node.selector)
            }

            // Determine element type based on path or selector
            const path = node.path
            const selector = node.selector != null ? String(node.selector) : ''

            if (path != null) {
              if (selector.includes(' > img') || selector.includes(' img') || selector.endsWith('img') || String(path).includes(',IMG')) {
                metric.element_type = 'image'

                // Try to extract image name from selector
                const imgMatch = selector.match(/img\.[^> ]+/)
                if (imgMatch != null && metric.element_url == null) {
                  metric.element_url = imgMatch[0]
                }
              } else if (
                String(path).includes(',SPAN') || String(path).includes(',P') || String(path).includes(',H')
              ) {
                metric.element_type = 'text'
              }
            }

            // Try to extract text content if available
            if (node.nodeLabel != null) {
              metric.element_content = String(node.nodeLabel).substring(
                0,
                100,
              )
            }
          }
          // Original handling for direct items
        } else if (itemData.node != null) {
          const node = itemData.node as Record<string, unknown>

          if (node.nodeLabel != null) {
            // Determine element type from node label
            if (String(node.nodeLabel).startsWith('<img')) {
              metric.element_type = 'image'
              // Try to extract image URL from the node snippet
              const snippet = node.snippet
              if (snippet != null) {
                const match = String(snippet).match(/src="([^"]+)"/)
                if (match != null && match[1] != null) {
                  metric.element_url = match[1]
                }
              }
            } else if (String(node.nodeLabel).startsWith('<video')) {
              metric.element_type = 'video'
            } else if (String(node.nodeLabel).startsWith('<h')) {
              metric.element_type = 'heading'
            } else {
              metric.element_type = 'text'
            }

            if (node.selector != null) {
              metric.element_selector = String(node.selector)
            }
          }
        }
      }
    }

    // 2. Try from lcp-lazy-loaded audit
    const lcpImageAudit = audits['lcp-lazy-loaded']
    if (lcpImageAudit != null && lcpImageAudit.details != null) {
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

    // 3. Try directly from the LCP audit details
    if (metric.element_url == null && lcp.details != null) {
      const lcpDirectDetails = lcp.details as unknown

      if (isObjectWithItems(lcpDirectDetails)) {
        for (const item of lcpDirectDetails.items) {
          const itemObj = item as Record<string, unknown>
          if (itemObj.url != null || (itemObj.node != null && typeof itemObj.node === 'object' && (itemObj.node as Record<string, unknown>).path != null)) {
            if (itemObj.url != null) {
              metric.element_url = String(itemObj.url)
              metric.element_type = String(itemObj.url).match(
                /\.(?:jpg|jpeg|png|gif|webp|svg)$/i,
              ) != null
                ? 'image'
                : 'resource'
            }
            if (itemObj.node != null && typeof itemObj.node === 'object') {
              const nodeObj = itemObj.node as Record<string, unknown>
              if (nodeObj.selector != null) {
                metric.element_selector = String(nodeObj.selector)
              }
            }
            break
          }
        }
      }
    }

    // 4. Check for specific audit that might contain image info
    const largestImageAudit = audits['largest-image-paint']
    if (largestImageAudit != null && largestImageAudit.details != null) {
      const imageDetails = largestImageAudit.details as unknown

      if (
        isObjectWithItems(imageDetails)
        && imageDetails.items.length > 0
      ) {
        const item = imageDetails.items[0] as Record<string, unknown>

        if (item.url != null) {
          // If we have a large image that's close in time to LCP, it's likely the LCP element
          metric.element_type = 'image'
          metric.element_url = String(item.url)
        }
      }
    }

    // 5. Check for network requests audit to find image resources
    if (metric.element_url == null) {
      const networkRequests = audits['network-requests']

      if (networkRequests != null && networkRequests.details != null) {
        const networkDetails = networkRequests.details as unknown

        if (isObjectWithItems(networkDetails)) {
          // Get all image resources loaded close to the LCP time
          const lcpTime = lcp.numericValue != null ? lcp.numericValue : 0
          const imageResources = networkDetails.items
            .filter(
              (item: unknown) => {
                const itemObj = item as Record<string, unknown>
                return itemObj.url != null
                  && itemObj.mimeType != null
                  && String(itemObj.mimeType).startsWith('image/')
                  && itemObj.endTime != null
                // Within 500ms of LCP
                  && Math.abs(Number(itemObj.endTime) - lcpTime) < 500
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
    metrics.push({
      id: 'fcp',
      score: fcp.score,
      value_ms: Math.round(fcp.numericValue ?? 0),
      passes_core_web_vital: (fcp.score ?? 0) >= 0.9,
    })
  }

  if (audits['speed-index'] != null) {
    const si = audits['speed-index']
    metrics.push({
      id: 'si',
      score: si.score,
      value_ms: Math.round(si.numericValue ?? 0),
    })
  }

  if (audits.interactive != null) {
    const tti = audits.interactive
    metrics.push({
      id: 'tti',
      score: tti.score,
      value_ms: Math.round(tti.numericValue ?? 0),
    })
  }

  // Add CLS (Cumulative Layout Shift)
  if (audits['cumulative-layout-shift'] != null) {
    const cls = audits['cumulative-layout-shift']
    metrics.push({
      id: 'cls',
      score: cls.score,
      // CLS is not in ms, but a unitless value
      // Convert to 3 decimal places
      value_ms: Math.round((cls.numericValue ?? 0) * 1000) / 1000,
      passes_core_web_vital: (cls.score ?? 0) >= 0.9,
    })
  }

  // Add TBT (Total Blocking Time)
  if (audits['total-blocking-time'] != null) {
    const tbt = audits['total-blocking-time']
    metrics.push({
      id: 'tbt',
      score: tbt.score,
      value_ms: Math.round(tbt.numericValue ?? 0),
      passes_core_web_vital: (tbt.score ?? 0) >= 0.9,
    })
  }

  // Extract opportunities
  if (audits['render-blocking-resources'] != null) {
    const rbrAudit = audits['render-blocking-resources']

    // Determine impact level based on potential savings
    let impact: 'critical' | 'serious' | 'moderate' | 'minor' = 'moderate'
    const savings = Math.round(rbrAudit.numericValue ?? 0)

    if (savings > 2000) {
      impact = 'critical'
    } else if (savings > 1000) {
      impact = 'serious'
    } else if (savings < 300) {
      impact = 'minor'
    }

    const opportunity: AIOptimizedOpportunity = {
      id: 'render_blocking_resources',
      savings_ms: savings,
      severity: impact,
      resources: [],
    }

    const rbrDetails = rbrAudit.details as unknown
    if (rbrDetails != null && isObjectWithItems(rbrDetails)) {
      // Determine how many items to include based on impact
      const itemLimit = DETAIL_LIMITS[impact]

      rbrDetails.items
        .slice(0, itemLimit)
        .forEach((item: unknown) => {
          const itemObj = item as Record<string, unknown>
          if (itemObj.url != null) {
            // Extract file name from full URL
            const url = String(itemObj.url)
            const fileName = url.split('/').pop() ?? url
            opportunity.resources.push({
              url: fileName,
              savings_ms: Math.round(itemObj.wastedMs != null ? Number(itemObj.wastedMs) : 0),
            })
          }
        })
    }

    if (opportunity.resources.length > 0) {
      opportunities.push(opportunity)
    }
  }

  if (audits['uses-http2'] != null) {
    const http2Audit = audits['uses-http2']

    // Determine impact level based on potential savings
    let impact: 'critical' | 'serious' | 'moderate' | 'minor' = 'moderate'
    const savings = Math.round(http2Audit.numericValue ?? 0)

    if (savings > 2000) {
      impact = 'critical'
    } else if (savings > 1000) {
      impact = 'serious'
    } else if (savings < 300) {
      impact = 'minor'
    }

    const opportunity: AIOptimizedOpportunity = {
      id: 'http2',
      savings_ms: savings,
      severity: impact,
      resources: [],
    }

    const http2Details = http2Audit.details as unknown
    if (http2Details != null && isObjectWithItems(http2Details)) {
      // Determine how many items to include based on impact
      const itemLimit = DETAIL_LIMITS[impact]

      http2Details.items
        .slice(0, itemLimit)
        .forEach((item: unknown) => {
          const itemObj = item as Record<string, unknown>
          if (itemObj.url != null) {
            // Extract file name from full URL
            const url = String(itemObj.url)
            const fileName = url.split('/').pop() ?? url
            opportunity.resources.push({ url: fileName })
          }
        })
    }

    if (opportunity.resources.length > 0) {
      opportunities.push(opportunity)
    }
  }

  // After extracting all metrics and opportunities, collect page stats
  // Extract page stats
  let page_stats: AIPageStats | undefined

  // Total page stats
  const networkRequests = audits['network-requests']
  const thirdPartyAudit = audits['third-party-summary']
  const mainThreadWork = audits['mainthread-work-breakdown']

  if (networkRequests?.details) {
    const resourceDetails = networkRequests.details as unknown

    if (isObjectWithItems(resourceDetails)) {
      const resources = resourceDetails.items
      const totalRequests = resources.length

      // Calculate total size and counts by type
      let totalSizeKb = 0
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

        // Count by mime type
        const mimeType = resourceObj.mimeType != null ? String(resourceObj.mimeType) : ''
        const url = resourceObj.url != null ? String(resourceObj.url) : ''
        if (mimeType.includes('javascript') || url.endsWith('.js')) {
          jsCount++
        } else if (mimeType.includes('css') || url.endsWith('.css')) {
          cssCount++
        } else if (
          mimeType.includes('image')
          || /\.(?:jpg|jpeg|png|gif|webp|svg)$/i.test(url)
        ) {
          imgCount++
        } else if (
          mimeType.includes('font')
          || /\.(?:woff|woff2|ttf|otf|eot)$/i.test(url)
        ) {
          fontCount++
        } else {
          otherCount++
        }
      })

      // Calculate third-party size
      let thirdPartySizeKb = 0
      if (thirdPartyAudit?.details) {
        const thirdPartyDetails = thirdPartyAudit.details as unknown
        if (isObjectWithItems(thirdPartyDetails)) {
          thirdPartyDetails.items.forEach((item: unknown) => {
            const itemObj = item as Record<string, unknown>
            if (itemObj.transferSize != null) {
              thirdPartySizeKb += Math.round(Number(itemObj.transferSize) / 1024)
            }
          })
        }
      }

      // Get main thread blocking time
      let mainThreadBlockingTimeMs = 0
      if (mainThreadWork?.numericValue != null && mainThreadWork.numericValue !== 0) {
        mainThreadBlockingTimeMs = Math.round(mainThreadWork.numericValue)
      }

      // Create page stats object
      page_stats = {
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

  // Generate prioritized recommendations
  const prioritized_recommendations: string[] = []

  // Add key recommendations based on failed audits with high impact
  if (audits['render-blocking-resources']?.score === 0) {
    prioritized_recommendations.push('Eliminate render-blocking resources')
  }

  if (audits['uses-responsive-images']?.score === 0) {
    prioritized_recommendations.push('Properly size images')
  }

  if (audits['uses-optimized-images']?.score === 0) {
    prioritized_recommendations.push('Efficiently encode images')
  }

  if (audits['uses-text-compression']?.score === 0) {
    prioritized_recommendations.push('Enable text compression')
  }

  if (audits['uses-http2']?.score === 0) {
    prioritized_recommendations.push('Use HTTP/2')
  }

  // Add more specific recommendations based on Core Web Vitals
  if (audits['largest-contentful-paint'] != null && (audits['largest-contentful-paint'].score ?? 1) < 0.5) {
    prioritized_recommendations.push('Improve Largest Contentful Paint (LCP)')
  }

  if (audits['cumulative-layout-shift'] != null && (audits['cumulative-layout-shift'].score ?? 1) < 0.5) {
    prioritized_recommendations.push('Reduce layout shifts (CLS)')
  }

  if (audits['total-blocking-time'] != null && (audits['total-blocking-time'].score ?? 1) < 0.5) {
    prioritized_recommendations.push('Reduce JavaScript execution time')
  }

  // Create the performance report content
  const reportContent: PerformanceReportContent = {
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

  // Return the full report following the LighthouseReport interface
  return {
    metadata,
    report: reportContent,
  }
}

import type {Flags, Result as LighthouseResult} from 'lighthouse'
import type {LighthouseConfig} from './types.js'
import lighthouse from 'lighthouse'
import {logger} from '@/logger'
import {connectToHeadlessBrowser, scheduleBrowserCleanup} from '@/PuppeteerService'
import {AuditCategory} from './types.js'

/**
 * Creates a Lighthouse configuration object
 * @param categories Array of categories to audit
 * @returns Lighthouse configuration and flags
 */
export function createLighthouseConfig(
  categories: string[] = [AuditCategory.ACCESSIBILITY]
): LighthouseConfig {
  return {flags: {
    output: ['json'],
    onlyCategories: categories,
    formFactor: 'desktop',
    port: void 0 as number | undefined,
    screenEmulation: {
      mobile: false,
      width: 1350,
      height: 940,
      deviceScaleFactor: 1,
      disabled: false
    }
  }, config: {extends: 'lighthouse:default', settings: {onlyCategories: categories, emulatedFormFactor: 'desktop', throttling: {cpuSlowdownMultiplier: 1}}}}
}

/**
 * Runs a Lighthouse audit on the specified URL via CDP
 * @param url The URL to audit
 * @param categories Array of categories to audit, defaults to ["accessibility"]
 * @returns Promise resolving to the Lighthouse result
 * @throws Error if the URL is invalid or if the audit fails
 */
export async function runLighthouseAudit(
  url: string,
  categories: string[]
): Promise<LighthouseResult> {
  logger.info(`Starting Lighthouse ${categories.join(', ')} audit for: ${url}`)

  if (!url || url === 'about:blank') {
    logger.error('Invalid URL for Lighthouse audit')
    throw new Error(
      'Cannot run audit on an empty page or about:blank. Please navigate to a valid URL first.'
    )
  }

  try {
    logger.info('Using dedicated headless browser for audit') // Always use a dedicated headless browser for audits

    const isPerformanceAudit = categories.includes(AuditCategory.PERFORMANCE) // Determine if this is a performance audit - we need to load all resources for performance audits

    try { // For accessibility or other audits, we can block non-essential resources // For performance audits, we want to load all resources
      const {port} = await connectToHeadlessBrowser(url, {blockResources: !isPerformanceAudit})

      logger.info(`Connected to browser on port: ${port}`)

      const {flags, config} = createLighthouseConfig(categories) // Create Lighthouse config
      flags.port = port

      logger.info(`Running Lighthouse with categories: ${categories.join(', ')}`)
      const runnerResult = await lighthouse(url, flags as Flags, config)
      logger.info('Lighthouse scan completed')

      if (!runnerResult?.lhr) {
        logger.error('Lighthouse audit failed to produce results')
        throw new Error('Lighthouse audit failed to produce results')
      }

      scheduleBrowserCleanup() // Schedule browser cleanup after a delay to allow for subsequent audits

      return runnerResult.lhr // Return the result
    }
    catch (browserError: unknown) {
      const errorMessage = browserError instanceof Error // Check if the error is related to Chrome/Edge not being available
        ? browserError.message
        : String(browserError)
      if (
        errorMessage.includes('Chrome could not be found')
        || errorMessage.includes('Failed to launch browser')
        || errorMessage.includes('spawn ENOENT')
      ) {
        throw new Error(
          'Chrome or Edge browser could not be found. Please ensure that Chrome or Edge is installed on your system to run audits.'
        )
      }
      throw browserError // Re-throw other errors
    }
  }
  catch (error: unknown) {
    logger.error('Lighthouse audit failed:', error)
    scheduleBrowserCleanup() // Schedule browser cleanup even if the audit fails
    throw new Error(
      `Lighthouse audit failed: ${
        error instanceof Error ? error.message : String(error)
      }`
    )
  }
}

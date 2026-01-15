import type {Browser, NetworkConditions, Page} from 'puppeteer-core'
import {execSync} from 'node:child_process'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import * as ChromeLauncher from 'chrome-launcher'
import puppeteer from 'puppeteer-core'
import {logger} from '@/logger' // ===== Configuration Types and Defaults =====

/**
 * Configuration interface for the Puppeteer service
 */
export interface PuppeteerServiceConfig {
  preferredBrowsers?: string[] // Order of browser preference ("chrome", "edge", "brave", "firefox") // Browser preferences
  customBrowserPaths?: Record<string, string> // Custom browser executable paths

  debugPorts?: number[] // Ports to try when connecting to existing browsers // Connection settings
  connectionTimeout?: number // Timeout for connection attempts in ms
  maxRetries?: number // Maximum number of retries for connections

  browserCleanupTimeout?: number // Timeout before closing inactive browsers (ms) // Browser cleanup settings

  blockResourceTypes?: string[] // Resource types to block for performance // Performance settings
}

const DEFAULT_CONFIG: PuppeteerServiceConfig = { // Default configuration values
  preferredBrowsers: ['chrome', 'edge', 'brave', 'firefox'],
  debugPorts: [9222, 9223, 9224, 9225],
  connectionTimeout: 10000,
  maxRetries: 3,
  browserCleanupTimeout: 60000,
  blockResourceTypes: ['image', 'font', 'media'],
} // ===== Global State ===== // - Safari: Not supported by Puppeteer // - Firefox: Partially supported (some features may not work) // - Brave: Fully supported (Chromium-based) // - Edge: Fully supported (Chromium-based) // - Chrome/Chromium: Fully supported (primary target) // Browser support notes:

let currentConfig: PuppeteerServiceConfig = {...DEFAULT_CONFIG} // Current active configuration

let headlessBrowserInstance: Browser | null = null // Browser instance management
let launchedBrowserWSEndpoint: string | null = null

let browserCleanupTimeout: NodeJS.Timeout | null = null // Cleanup management
let BROWSER_CLEANUP_TIMEOUT = 60000 // 60 seconds default

let detectedBrowserPath: string | null = null // Cache for browser executable paths // ===== Configuration Functions =====

/**
 * Configure the Puppeteer service with custom settings
 * @param config Partial configuration to override defaults
 */
export function configurePuppeteerService(
  config: Partial<PuppeteerServiceConfig>,
): void {
  currentConfig = {...DEFAULT_CONFIG, ...config}

  if (config.browserCleanupTimeout != null && config.browserCleanupTimeout !== BROWSER_CLEANUP_TIMEOUT) BROWSER_CLEANUP_TIMEOUT = config.browserCleanupTimeout // Update the timeout if it was changed

  logger.info('Puppeteer service configured:', currentConfig)
} // ===== Browser Management =====

/**
 * Get or create a headless browser instance
 * @returns Promise resolving to a browser instance
 */
async function getHeadlessBrowserInstance(): Promise<Browser> {
  logger.info('Browser instance request started')

  cancelScheduledCleanup() // Cancel any scheduled cleanup

  if (headlessBrowserInstance != null) { // Try to reuse existing browser
    try {
      const pages = await headlessBrowserInstance.pages()
      logger.info(`Reusing existing headless browser with ${pages.length} pages`)
      return headlessBrowserInstance
    }
    catch {
      logger.info('Existing browser instance is no longer valid, creating a new one')
      headlessBrowserInstance = null
      launchedBrowserWSEndpoint = null
    }
  }

  return launchNewBrowser() // Create a new browser instance
}

/**
 * Launches a new browser instance
 * @returns Promise resolving to a browser instance
 */
async function launchNewBrowser(): Promise<Browser> {
  logger.info('Creating new headless browser instance')

  const userDataDir = createTempUserDataDir() // Setup temporary user data directory
  let browser: Browser | null = null

  try {
    const launchOptions = configureLaunchOptions(userDataDir) // Configure launch options

    await setCustomBrowserExecutable(launchOptions) // Set custom browser executable

    logger.info('Launching browser with options:', JSON.stringify({headless: launchOptions.headless, executablePath: launchOptions.executablePath})) // Launch the browser

    browser = await puppeteer.launch(launchOptions)

    launchedBrowserWSEndpoint = browser.wsEndpoint() // Store references to the browser instance
    headlessBrowserInstance = browser

    setupBrowserCleanupHandlers(browser, userDataDir) // Setup cleanup handlers

    logger.info('Browser ready')
    return browser
  }
  catch (error: unknown) {
    logger.error('Failed to launch browser:', error) // Clean up resources

    try { await browser?.close() }
    catch (closeError: unknown) { logger.error('Error closing browser:', closeError) }
    headlessBrowserInstance = null
    launchedBrowserWSEndpoint = null

    try { fs.rmSync(userDataDir, {recursive: true, force: true}) }
    catch (fsError: unknown) { logger.error('Error removing temporary directory:', fsError) } // Clean up the temporary directory

    throw error
  }
}

/**
 * Creates a temporary user data directory for the browser
 * @returns Path to the created directory
 */
function createTempUserDataDir(): string {
  const tempDir = os.tmpdir()
  const uniqueId = `${Date.now().toString()}-${Math.random()
    .toString(36)
    .slice(2)}`
  const userDataDir = path.join(tempDir, `browser-debug-profile-${uniqueId}`)
  fs.mkdirSync(userDataDir, {recursive: true})
  logger.info(`Using temporary user data directory: ${userDataDir}`)
  return userDataDir
}

/**
 * Configures browser launch options
 * @param userDataDir Path to the user data directory
 * @returns Launch options object
 */
function configureLaunchOptions(userDataDir: string): Record<string, unknown> {
  const launchOptions: Record<string, unknown> = {args: [
    '--remote-debugging-port=0', // Use dynamic port
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-dev-shm-usage',
    '--disable-extensions',
    '--disable-component-extensions-with-background-pages',
    '--disable-background-networking',
    '--disable-backgrounding-occluded-windows',
    '--disable-default-apps',
    '--disable-sync',
    '--disable-translate',
    '--metrics-recording-only',
    '--no-pings',
    '--safebrowsing-disable-auto-update',
  ]}

  launchOptions.headless = 'new' // Add headless mode (using any to bypass type checking issues)

  return launchOptions
}

/**
 * Sets a custom browser executable path if configured
 * @param launchOptions Launch options object to modify
 */
async function setCustomBrowserExecutable(launchOptions: Record<string, unknown>): Promise<void> {
  if ( // First, try to use a custom browser path from configuration
    currentConfig.customBrowserPaths
    && Object.keys(currentConfig.customBrowserPaths).length > 0
  ) {
    const preferredBrowsers = currentConfig.preferredBrowsers ?? [
      'chrome',
      'edge',
      'brave',
      'firefox',
    ]

    for (const browser of preferredBrowsers) {
      if (
        currentConfig.customBrowserPaths[browser]
        && fs.existsSync(currentConfig.customBrowserPaths[browser])
      ) {
        launchOptions.executablePath
          = currentConfig.customBrowserPaths[browser]

        if (browser === 'firefox') launchOptions.product = 'firefox' // Set product to firefox if using Firefox browser

        logger.info(`Using custom ${browser} path: `, launchOptions.executablePath)
        return
      }
    }
  }

  try { // If no custom path is found, use cached path or detect a new one
    if (detectedBrowserPath != null && fs.existsSync(detectedBrowserPath)) {
      logger.info(`Using cached browser path: ${detectedBrowserPath}`)
      launchOptions.executablePath = detectedBrowserPath

      if (detectedBrowserPath.includes('firefox')) { // Check if the detected browser is Firefox
        launchOptions.product = 'firefox'
        logger.info('Setting product to firefox for Firefox browser')
      }
    } else {
      detectedBrowserPath = await findBrowserExecutablePath()
      launchOptions.executablePath = detectedBrowserPath

      if (detectedBrowserPath.includes('firefox')) { // Check if the detected browser is Firefox
        launchOptions.product = 'firefox'
        logger.info('Setting product to firefox for Firefox browser')
      }

      logger.info(`Using detected browser path: `, launchOptions.executablePath)
    }
  }
  catch (error: unknown) {
    logger.error('Failed to detect browser executable path:', error)
    throw new Error(
      'No browser executable path found. Please specify a custom browser path in the configuration.',
    )
  }
}

/**
 * Find a browser executable path on the current system
 * @returns Path to a browser executable
 */
async function findBrowserExecutablePath(): Promise<string> {
  try { // Try to use chrome-launcher (most reliable method)
    logger.info('Attempting to find Chrome using chrome-launcher...')

    const chrome = await ChromeLauncher.launch({chromeFlags: ['--headless'], handleSIGINT: false}) // Launch Chrome using chrome-launcher // chrome-launcher stores the Chrome executable path differently than Puppeteer // Let's try different approaches to get it

    let chromePath = '' // First check if we can access it directly

    if (chrome.process.spawnfile) { // Chrome version data often contains the path
      chromePath = chrome.process.spawnfile
      logger.info('Found Chrome path from process.spawnfile')
    } else {
      logger.info('Trying to determine Chrome path using other methods') // In newer versions, it's directly accessible // Try to get the Chrome path from chrome-launcher

      const p = await import('node:process') // chrome-launcher has this inside but doesn't expose it directly // This will actually return the real Chrome path for us
      const possiblePaths = [
        p.env.CHROME_PATH,
        ...process.platform === 'darwin' // Common paths by OS
          ? ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome']
          : process.platform === 'win32'
            ? [
                `${p.env.PROGRAMFILES}\\Google\\Chrome\\Application\\chrome.exe`,
                `${p.env['PROGRAMFILES(X86)']}\\Google\\Chrome\\Application\\chrome.exe`,
              ]
            : ['/usr/bin/google-chrome'],
      ].filter(Boolean)

      for (const _p of possiblePaths) { // Use the first valid path
        if (_p !== void 0 && fs.existsSync(_p)) {
          chromePath = _p
          logger.info('Found Chrome path from common locations')
          break
        }
      }
    }

    chrome.kill() // Always kill the Chrome instance we just launched

    if (chromePath) {
      logger.info(`Chrome found via chrome-launcher: ${chromePath}`)
      return chromePath
    }
    logger.info('Chrome launched but couldn\'t determine executable path')
  }
  catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error) // Check if it's a ChromeNotInstalledError
    if (
      errorMessage.includes('No Chrome installations found')
      || (error as NodeJS.ErrnoException)?.code === 'ERR_LAUNCHER_NOT_INSTALLED'
    ) {
      logger.info('Chrome not installed. Falling back to manual detection')
    } else {
      logger.error('Failed to find Chrome using chrome-launcher:', error)
      logger.info('Falling back to manual detection')
    }
  } // If chrome-launcher failed, use manual detection

  const {platform} = process
  const preferredBrowsers = currentConfig.preferredBrowsers ?? [
    'chrome',
    'edge',
    'brave',
    'firefox',
  ]

  logger.info(`Attempting to detect browser executable path on ${platform}...`)

  switch (platform) { // Platform-specific detection strategies
    case 'win32': {
      let registryPath = null // Windows - try registry detection for Chrome
      try {
        logger.info('Checking Windows registry for Chrome...')
        const regOutput = execSync('reg query "HKEY_LOCAL_MACHINE\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\chrome.exe" /ve', {encoding: 'utf8'}) // Try HKLM first

        const match = /REG_(?:SZ|EXPAND_SZ)\s+(\S+)/i.exec(regOutput) // Extract path from registry output
        if (match?.[1] != null && match[1] !== '') {
          registryPath = match[1].replaceAll('\\"', '')
          if (fs.existsSync(registryPath)) { // Verify the path exists
            logger.info(`Found Chrome via HKLM registry: ${registryPath}`)
            return registryPath
          }
        }
      }
      catch {
        try { // Try HKCU if HKLM fails
          logger.info('Checking user registry for Chrome...')
          const regOutput = execSync('reg query "HKEY_CURRENT_USER\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\chrome.exe" /ve', {encoding: 'utf8'})

          const match = /REG_(?:SZ|EXPAND_SZ)\s+(\S+)/i.exec(regOutput) // Extract path from registry output
          if (match?.[1] != null && match[1] !== '') {
            registryPath = match[1].replaceAll('\\"', '')
            if (fs.existsSync(registryPath)) { // Verify the path exists
              logger.info(`Found Chrome via HKCU registry: ${registryPath}`)
              return registryPath
            }
          }
        }
        catch { logger.info('Failed to find Chrome via registry, continuing with path checks') }
      }

      try { // Try to find Chrome through BLBeacon registry key (version info)
        logger.info('Checking Chrome BLBeacon registry...')
        const regOutput = execSync('reg query "HKEY_CURRENT_USER\\Software\\Google\\Chrome\\BLBeacon" /v version', {encoding: 'utf8'})

        if (regOutput) {
          const p = await import('node:process')
          const programFiles = p.env.PROGRAMFILES ?? 'C:\\Program Files' // If BLBeacon exists, Chrome is likely installed in the default location
          const programFilesX86 = p.env['PROGRAMFILES(X86)'] ?? 'C:\\Program Files (x86)'

          const defaultChromePaths = [
            path.join(programFiles, 'Google\\Chrome\\Application\\chrome.exe'),
            path.join(programFilesX86, 'Google\\Chrome\\Application\\chrome.exe'),
          ]

          for (const chromePath of defaultChromePaths) {
            if (fs.existsSync(chromePath)) {
              logger.info(`Found Chrome via BLBeacon registry hint: ${chromePath}`)
              return chromePath
            }
          }
        }
      }
      catch { logger.info('Failed to find Chrome via BLBeacon registry') }
      const p = await import('node:process')
      const programFiles = p.env.PROGRAMFILES ?? 'C:\\Program Files' // Continue with regular path checks
      const programFilesX86 = p.env['PROGRAMFILES(X86)'] ?? 'C:\\Program Files (x86)'

      const winBrowserPaths = {chrome: [ // Common Windows browser paths
        path.join(programFiles, 'Google\\Chrome\\Application\\chrome.exe'),
        path.join(programFilesX86, 'Google\\Chrome\\Application\\chrome.exe'),
      ], edge: [
        path.join(programFiles, 'Microsoft\\Edge\\Application\\msedge.exe'),
        path.join(programFilesX86, 'Microsoft\\Edge\\Application\\msedge.exe'),
      ], brave: [
        path.join(programFiles, 'BraveSoftware\\Brave-Browser\\Application\\brave.exe'),
        path.join(programFilesX86, 'BraveSoftware\\Brave-Browser\\Application\\brave.exe'),
      ], firefox: [
        path.join(programFiles, 'Mozilla Firefox\\firefox.exe'),
        path.join(programFilesX86, 'Mozilla Firefox\\firefox.exe'),
      ]}

      for (const browser of preferredBrowsers) { // Check each browser in preferred order
        const paths = winBrowserPaths[browser as keyof typeof winBrowserPaths] ?? []
        for (const browserPath of paths) {
          if (fs.existsSync(browserPath)) {
            logger.info(`Found ${browser} at ${browserPath}`)
            return browserPath
          }
        }
      }

      break
    }
    case 'darwin': {
      const macBrowserPaths = { // macOS browser paths
        chrome: ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'],
        edge: ['/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge'],
        brave: ['/Applications/Brave Browser.app/Contents/MacOS/Brave Browser'],
        firefox: ['/Applications/Firefox.app/Contents/MacOS/firefox'],
        safari: ['/Applications/Safari.app/Contents/MacOS/Safari'],
      }

      for (const browser of preferredBrowsers) { // Check each browser in preferred order
        const paths
          = macBrowserPaths[browser as keyof typeof macBrowserPaths] ?? []
        for (const browserPath of paths) {
          if (fs.existsSync(browserPath)) {
            logger.info(`Found ${browser} at ${browserPath}`)
            if (browser === 'safari') { // Safari is detected but not supported by Puppeteer
              logger.info('Safari detected but not supported by Puppeteer. Continuing search...')
              continue
            }
            return browserPath
          }
        }
      }

      break
    }
    case 'linux': {
      const linuxBrowserCommands = {chrome: ['google-chrome', 'chromium', 'chromium-browser'], edge: ['microsoft-edge'], brave: ['brave-browser'], firefox: ['firefox']} // Linux browser commands

      for (const browser of preferredBrowsers) { // Check each browser in preferred order
        const commands = linuxBrowserCommands[browser as keyof typeof linuxBrowserCommands] ?? []
        for (const cmd of commands) {
          try {
            const browserPath = execSync( // command -v works in most shells, fallback to which or type // Use more universal commands for Linux to find executables
              `command -v ${cmd} || which ${cmd} || type -p ${cmd} 2>/dev/null`,
              {encoding: 'utf8'},
            ).trim()

            if (browserPath && fs.existsSync(browserPath)) {
              logger.info(`Found ${browser} at ${browserPath}`)
              return browserPath
            }
          }
          catch { /* Command not found, continue to next */ }
        }
      }

      const alternativeLocations = [ // Additional check for unusual locations on Linux
        '/usr/bin/google-chrome',
        '/usr/bin/chromium',
        '/usr/bin/chromium-browser',
        '/snap/bin/chromium',
        '/snap/bin/google-chrome',
        '/opt/google/chrome/chrome',
      ]

      for (const location of alternativeLocations) {
        if (fs.existsSync(location)) {
          logger.info(`Found browser at alternative location: ${location}`)
          return location
        }
      }

      break
    }
  } // No default

  throw new Error(
    `No browser executable found for platform ${platform}. Please specify a custom browser path.`,
  )
}

/**
 * Sets up cleanup handlers for the browser instance
 * @param browser Browser instance
 * @param userDataDir Path to the user data directory to clean up
 */
function setupBrowserCleanupHandlers(
  browser: Browser,
  userDataDir: string,
): void {
  browser.on('disconnected', () => {
    logger.info(`Browser disconnected. Scheduling cleanup for: ${userDataDir}`)

    cancelScheduledCleanup() // Clear any existing cleanup timeout when browser is disconnected

    setTimeout(() => { // Delayed cleanup to avoid conflicts with potential new browser instances
      if (!headlessBrowserInstance) { // Only remove the directory if no new browser has been launched
        logger.info(`Cleaning up temporary directory: ${userDataDir}`)
        try {
          fs.rmSync(userDataDir, {recursive: true, force: true})
          logger.info(`Successfully removed directory: ${userDataDir}`)
        }
        catch (error: unknown) { logger.error(`Failed to remove directory ${userDataDir}:`, error) }
      } else logger.info(`Skipping cleanup for ${userDataDir} as new browser instance is active`)
    }, 5000) // 5-second delay for cleanup

    launchedBrowserWSEndpoint = null // Reset browser instance variables
    headlessBrowserInstance = null
  })
} // ===== Cleanup Management =====

/**
 * Cancels any scheduled browser cleanup
 */
function cancelScheduledCleanup(): void {
  if (!browserCleanupTimeout) return

  logger.info('Cancelling scheduled browser cleanup')
  clearTimeout(browserCleanupTimeout)
  browserCleanupTimeout = null
}

/**
 * Schedules automatic cleanup of the browser instance after inactivity
 */
export function scheduleBrowserCleanup(): void {
  cancelScheduledCleanup() // Clear any existing timeout first

  if (!headlessBrowserInstance) return // Only schedule cleanup if we have an active browser instance

  logger.info(`Scheduling browser cleanup in ${BROWSER_CLEANUP_TIMEOUT / 1000} seconds`)
  browserCleanupTimeout = setTimeout(() => {
    logger.info('Executing scheduled browser cleanup')
    if (headlessBrowserInstance) {
      logger.info('Closing headless browser instance')
      void headlessBrowserInstance.close()
      headlessBrowserInstance = null
      launchedBrowserWSEndpoint = null
    }
    browserCleanupTimeout = null
  }, BROWSER_CLEANUP_TIMEOUT)
} // ===== Public Browser Connection API =====

/**
 * Connects to a headless browser for web operations
 * @param url The URL to navigate to
 * @param options Connection and emulation options
 * @param options.blockResources Whether to block resources like images, CSS, etc.
 * @param options.customResourceBlockList Custom list of resource types to block
 * @param options.emulateDevice Device type to emulate (mobile, tablet, desktop)
 * @param options.emulateNetworkCondition Network condition to emulate
 * @param options.viewport Viewport dimensions
 * @param options.viewport.width Viewport width in pixels
 * @param options.viewport.height Viewport height in pixels
 * @param options.headers Custom HTTP headers to send with requests
 * @param options.locale Browser locale setting
 * @param options.timezoneId Timezone identifier
 * @param options.userAgent Custom user agent string
 * @param options.waitForSelector Selector to wait for after navigation
 * @param options.waitForTimeout Timeout for waiting operations
 * @param options.cookies Cookies to set in the browser
 * @returns Promise resolving to browser, port, and page objects
 */
export async function connectToHeadlessBrowser(
  url: string,
  options: {
    blockResources?: boolean
    customResourceBlockList?: string[]
    emulateDevice?: 'mobile' | 'tablet' | 'desktop'
    emulateNetworkCondition?: 'slow3G' | 'fast3G' | '4G' | 'offline'
    viewport?: {width: number, height: number}
    locale?: string
    timezoneId?: string
    userAgent?: string
    waitForSelector?: string
    waitForTimeout?: number
    cookies?: {
      name: string
      value: string
      domain?: string
      path?: string
    }[]
    headers?: Record<string, string>
  } = {},
): Promise<{
  browser: Browser
  port: number
  page: Page
}> {
  logger.info(
    `Connecting to headless browser for ${url}${options.blockResources ? ' (blocking non-essential resources)' : ''
    }`,
  )

  try {
    try { URL.parse(url) }
    catch { throw new Error(`Invalid URL format: ${url}`) } // Validate URL format

    const browser = await getHeadlessBrowserInstance() // Get or create a browser instance

    if (launchedBrowserWSEndpoint === null) throw new Error('Failed to retrieve WebSocket endpoint for browser')

    const port = Number.parseInt(launchedBrowserWSEndpoint.split(':')[2].split('/')[0]) // Extract port from WebSocket endpoint

    logger.info('Creating a new page for this audit') // Always create a new page for each audit to avoid request interception conflicts
    const page = await browser.newPage()

    const navigationTimeout = 10000 // 10 seconds // Set a longer timeout for navigation
    page.setDefaultNavigationTimeout(navigationTimeout)

    logger.info(`Navigating to ${url}`) // Navigate to the URL
    await page.goto(url, {
      waitUntil: 'networkidle2', // Wait until there are no more network connections for at least 500ms
      timeout: navigationTimeout,
    })

    if (options.headers && Object.keys(options.headers).length > 0) { // Set custom headers if provided
      await page.setExtraHTTPHeaders(options.headers)
      logger.info('Set custom HTTP headers')
    }

    if (options.cookies && options.cookies.length > 0) { // Set cookies if provided
      const urlObj = new URL(url)
      const cookiesWithDomain = options.cookies.map(cookie => ({...cookie, domain: cookie.domain ?? urlObj.hostname, path: cookie.path ?? '/'}))
      await page.setCookie(...cookiesWithDomain)
      logger.info(`Set ${options.cookies.length} cookies`)
    }

    if (options.viewport) { // Set custom viewport if specified
      await page.setViewport(options.viewport)
      logger.info(`Set viewport to ${options.viewport.width}x${options.viewport.height}`)
    } else if (options.emulateDevice) {
      let viewport // Set common device emulation presets
      let {userAgent} = options

      switch (options.emulateDevice) {
        case 'mobile':
          viewport = {width: 375, height: 667, isMobile: true, hasTouch: true}
          userAgent = userAgent ?? 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X)'
          break
        case 'tablet':
          viewport = {width: 768, height: 1024, isMobile: true, hasTouch: true}
          userAgent = userAgent ?? 'Mozilla/5.0 (iPad; CPU OS 13_2_3 like Mac OS X)'
          break
        case 'desktop':
        default: viewport = {width: 1280, height: 800, isMobile: false, hasTouch: false}; break
      }

      await page.setViewport(viewport)
      if (userAgent !== void 0) await page.setUserAgent(userAgent)

      logger.info(`Emulating ${options.emulateDevice} device`)
    }

    if (options.locale !== void 0) { // Set locale and timezone if provided
      await page.evaluateOnNewDocument(locale => {
        Object.defineProperty(navigator, 'language', {get: () => locale})
        Object.defineProperty(navigator, 'languages', {get: () => [locale]})
      }, options.locale)
      logger.info(`Set locale to ${options.locale}`)
    }

    if (options.timezoneId !== void 0) {
      await page.emulateTimezone(options.timezoneId)
      logger.info(`Set timezone to ${options.timezoneId}`)
    }

    if (options.emulateNetworkCondition) { // Emulate network conditions if specified
      let networkConditions: NetworkConditions

      switch (options.emulateNetworkCondition) {
        case 'slow3G': networkConditions = {offline: false, latency: 400, download: (500 * 1024) / 8, upload: (500 * 1024) / 8}; break
        case 'fast3G': networkConditions = {offline: false, latency: 150, download: (1.5 * 1024 * 1024) / 8, upload: (750 * 1024) / 8}; break
        case '4G': networkConditions = {offline: false, latency: 50, download: (4 * 1024 * 1024) / 8, upload: (2 * 1024 * 1024) / 8}; break
        case 'offline': networkConditions = {download: 0, latency: 0, upload: 0, offline: true}; break
        default: networkConditions = {download: 0, latency: 0, upload: 0, offline: false}
      }

      await page.emulateNetworkConditions(networkConditions)
      logger.info(`Emulating ${options.emulateNetworkCondition} network conditions`)
    }

    if (options.blockResources) { // Check if we should block resources based on the options
      const resourceTypesToBlock = options.customResourceBlockList
        ?? currentConfig.blockResourceTypes ?? ['image', 'font', 'media']

      await page.setRequestInterception(true)
      page.on('request', request => {
        const resourceType = request.resourceType() // Block unnecessary resources to speed up loading
        if (resourceTypesToBlock.includes(resourceType)) void request.abort()
        else void request.continue()
      })

      logger.info(`Blocking resource types: ${resourceTypesToBlock.join(', ')}`)
    }

    if (options.waitForSelector !== void 0) { // Wait for a specific selector if requested
      try {
        logger.info(`Waiting for selector: ${options.waitForSelector}`)
        await page.waitForSelector(options.waitForSelector, {timeout: options.waitForTimeout ?? 30000})
      }
      catch (selectorError: unknown) {
        const message = selectorError instanceof Error ? selectorError.message : String(selectorError)
        logger.warn(`Failed to find selector "${options.waitForSelector}": ${message}`)
      } // Continue anyway, don't fail the whole operation
    }

    return {browser, port, page}
  }
  catch (error: unknown) {
    logger.error('Failed to connect to headless browser:', error)
    throw new Error(
      `Failed to connect to headless browser: ${error instanceof Error ? error.message : String(error)
      }`,
    )
  }
}

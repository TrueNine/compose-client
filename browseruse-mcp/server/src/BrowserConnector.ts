#!/usr/bin/env node

import type { Buffer } from 'node:buffer'
import type { IncomingMessage, Server } from 'node:http'
import type { Socket } from 'node:net'
import type { LighthouseReport } from './lighthouse/index.js'
import { exec } from 'node:child_process'
import fs from 'node:fs'
import * as net from 'node:net'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import bodyParser from 'body-parser'
import cors from 'cors'
import express from 'express'
import { WebSocket, WebSocketServer } from 'ws'
import { AuditCategory, runAccessibilityAudit, runBestPracticesAudit, runPerformanceAudit, runSEOAudit } from '@/lighthouse'
import { logger } from '@/logger'

// Define proper types for better type safety
interface LogEntry {
  type: string
  timestamp: string
  level?: string
  message?: string
  url?: string
  method?: string
  status?: number
  requestHeaders?: Record<string, string>
  responseHeaders?: Record<string, string>
  element?: unknown
  tabId?: string | number
}

interface Settings {
  logLimit: number
  queryLimit: number
  showRequestHeaders: boolean
  showResponseHeaders: boolean
  model: string
  stringSizeLimit: number
  maxLogSize: number
  screenshotPath: string
  serverHost: string
}

interface NetworkInterface {
  address: string
  netmask: string
  family: string
  mac: string
  internal: boolean
  cidr: string | null
}

/**
 * Converts a file path to the appropriate format for the current platform
 * Handles Windows, WSL, macOS and Linux path formats
 *
 * @param inputPath - The path to convert
 * @returns The converted path appropriate for the current platform
 */
function convertPathForCurrentPlatform(inputPath: string): string {
  const platform = os.platform()

  // If no path provided, return as is
  if (!inputPath) {
    return inputPath
  }

  logger.info(`Converting path "${inputPath}" for platform: ${platform}`)

  // Windows-specific conversion
  if (platform === 'win32') {
    // Convert forward slashes to backslashes
    return inputPath.replace(/\//g, '\\')
  }

  // Linux/Mac-specific conversion
  if (platform === 'linux' || platform === 'darwin') {
    // Check if this is a Windows UNC path (starts with \\)
    if (inputPath.startsWith('\\\\') || inputPath.includes('\\')) {
      // Check if this is a WSL path (contains wsl.localhost or wsl$)
      if (inputPath.includes('wsl.localhost') || inputPath.includes('wsl$')) {
        // Extract the path after the distribution name
        // Handle both \\wsl.localhost\Ubuntu\path and \\wsl$\Ubuntu\path formats
        const parts = inputPath.split('\\').filter((part) => part.length > 0)
        logger.info('Path parts:', parts)

        // Find the index after the distribution name
        const distNames = [
          'Ubuntu',
          'Debian',
          'kali',
          'openSUSE',
          'SLES',
          'Fedora',
        ]

        // Find the distribution name in the path
        let distIndex = -1
        for (const dist of distNames) {
          const index = parts.findIndex(
            (part) => part === dist || part.toLowerCase() === dist.toLowerCase(),
          )
          if (index !== -1) {
            distIndex = index
            break
          }
        }

        if (distIndex !== -1 && distIndex + 1 < parts.length) {
          // Reconstruct the path as a native Linux path
          const linuxPath = `/${parts.slice(distIndex + 1).join('/')}`
          logger.info(
            `Converted Windows WSL path "${inputPath}" to Linux path "${linuxPath}"`,
          )
          return linuxPath
        }

        // If we couldn't find a distribution name but it's clearly a WSL path,
        // try to extract everything after wsl.localhost or wsl$
        const wslIndex = parts.findIndex(
          (part) =>
            part === 'wsl.localhost'
            || part === 'wsl$'
            || part.toLowerCase() === 'wsl.localhost'
            || part.toLowerCase() === 'wsl$',
        )

        if (wslIndex !== -1 && wslIndex + 2 < parts.length) {
          // Skip the WSL prefix and distribution name
          const linuxPath = `/${parts.slice(wslIndex + 2).join('/')}`
          logger.info(
            `Converted Windows WSL path "${inputPath}" to Linux path "${linuxPath}"`,
          )
          return linuxPath
        }
      }

      // For non-WSL Windows paths, just normalize the slashes
      const normalizedPath = inputPath
        .replace(/\\\\/g, '/')
        .replace(/\\/g, '/')
      logger.info(
        `Converted Windows UNC path "${inputPath}" to "${normalizedPath}"`,
      )
      return normalizedPath
    }

    // Handle Windows drive letters (e.g., C:\path\to\file)
    if (/^[A-Z]:\\/i.test(inputPath)) {
      // Convert Windows drive path to Linux/Mac compatible path
      const normalizedPath = inputPath
        .replace(/^[A-Z]:\\/i, '/')
        .replace(/\\/g, '/')
      logger.info(
        `Converted Windows drive path "${inputPath}" to "${normalizedPath}"`,
      )
      return normalizedPath
    }
  }

  // Return the original path if no conversion was needed or possible
  return inputPath
}

// Function to get default downloads folder
function getDefaultDownloadsFolder(): string {
  const homeDir = os.homedir()
  // Downloads folder is typically the same path on Windows, macOS, and Linux
  const downloadsPath = path.join(homeDir, 'Downloads', 'mcp-screenshots')
  return downloadsPath
}

// We store logs in memory
const consoleLogs: LogEntry[] = []
const consoleErrors: LogEntry[] = []
const networkErrors: LogEntry[] = []
const networkSuccess: LogEntry[] = []
const allXhr: LogEntry[] = []

// Store the current URL from the extension
let currentUrl: string = ''

// Store the current tab ID from the extension
let currentTabId: string | number | null = null

// Add settings state
let currentSettings: Settings = {
  logLimit: 50,
  queryLimit: 30000,
  showRequestHeaders: false,
  showResponseHeaders: false,
  model: 'claude-3-sonnet',
  stringSizeLimit: 500,
  maxLogSize: 20000,
  screenshotPath: getDefaultDownloadsFolder(),
  // Add server host configuration
  // Default to all interfaces
  serverHost: process.env.SERVER_HOST ?? '0.0.0.0',
}

// Add new storage for selected element
let selectedElement: unknown = null

// Add new state for tracking screenshot requests
interface ScreenshotCallback {
  resolve: (value: {
    data: string
    path?: string
    autoPaste?: boolean
  }) => void
  reject: (reason: Error) => void
}

const screenshotCallbacks = new Map<string, ScreenshotCallback>()

// Function to get available port starting with the given port
async function getAvailablePort(
  startPort: number,
  maxAttempts: number = 10,
): Promise<number> {
  let currentPort = startPort
  let attempts = 0

  while (attempts < maxAttempts) {
    try {
      // Try to create a server on the current port
      // We'll use a raw Node.js net server for just testing port availability
      await new Promise<void>((resolve, reject) => {
        const testServer = net.createServer()

        // Handle errors (e.g., port in use)
        testServer.once('error', (err: NodeJS.ErrnoException) => {
          if (err.code === 'EADDRINUSE') {
            logger.info(`Port ${currentPort} is in use, trying next port...`)
            currentPort++
            attempts++
            // Continue to next iteration
            resolve()
          } else {
            // Different error, propagate it
            reject(err)
          }
        })

        // If we can listen, the port is available
        testServer.once('listening', () => {
          // Make sure to close the server to release the port
          testServer.close(() => {
            logger.info(`Found available port: ${currentPort}`)
            resolve()
          })
        })

        // Try to listen on the current port
        testServer.listen(currentPort, currentSettings.serverHost)
      })

      // If we reach here without incrementing the port, it means the port is available
      return currentPort
    } catch (error: unknown) {
      logger.error(`Error checking port ${currentPort}:`, error)
      // For non-EADDRINUSE errors, try the next port
      currentPort++
      attempts++
    }
  }

  // If we've exhausted all attempts, throw an error
  throw new Error(
    `Could not find an available port after ${maxAttempts} attempts starting from ${startPort}`,
  )
}

// Start with requested port and find an available one
const REQUESTED_PORT = Number.parseInt(process.env.PORT ?? '3025', 10)

let PORT = REQUESTED_PORT

// Create application and initialize middleware
const app = express()
app.use(cors())
// Increase JSON body parser limit to 50MB to handle large screenshots
app.use(bodyParser.json({ limit: '50mb' }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

// Helper to process logs based on settings
function processLogsWithSettings(logs: LogEntry[]): LogEntry[] {
  return logs.map((log) => {
    const processedLog = { ...log }

    if (log.type === 'network-request') {
      // Handle headers visibility
      if (!currentSettings.showRequestHeaders) {
        delete processedLog.requestHeaders
      }
      if (!currentSettings.showResponseHeaders) {
        delete processedLog.responseHeaders
      }
    }

    return processedLog
  })
}

// Helper to calculate size of a log entry
function calculateLogSize(log: LogEntry): number {
  return JSON.stringify(log).length
}

// Helper to truncate logs based on character limit
function truncateLogsToQueryLimit(logs: LogEntry[]): LogEntry[] {
  if (logs.length === 0) {
    return logs
  }

  // First process logs according to current settings
  const processedLogs = processLogsWithSettings(logs)

  let currentSize = 0
  const result = []

  for (const log of processedLogs) {
    const logSize = calculateLogSize(log)

    // Check if adding this log would exceed the limit
    if (currentSize + logSize > currentSettings.queryLimit) {
      logger.info(
        `Reached query limit (${currentSize}/${currentSettings.queryLimit}), truncating logs`,
      )
      break
    }

    // Add log and update size
    result.push(log)
    currentSize += logSize
    logger.info(`Added log of size ${logSize}, total size now: ${currentSize}`)
  }

  return result
}

// Endpoint for the extension to POST data
app.post('/extension-log', (req, res) => {
  logger.info('\n=== Received Extension Log ===')
  const bodyObj = req.body as Record<string, unknown>
  const bodyData = bodyObj?.data as Record<string, unknown> | undefined
  logger.info('Request body:', {
    dataType: bodyObj != null && bodyData != null ? bodyData.type : null,
    timestamp: bodyObj != null && bodyData != null ? bodyData.timestamp : null,
    hasSettings: bodyObj != null && bodyObj.settings != null,
  })

  const data = bodyObj.data
  const settings = bodyObj.settings

  // Update settings if provided
  if (settings != null) {
    logger.info('Updating settings:', settings)
    const settingsObj = settings as Record<string, unknown>
    currentSettings = {
      ...currentSettings,
      ...settingsObj,
    } as Settings
  }

  if (data == null) {
    logger.info('Warning: No data received in log request')
    res.status(400).json({ status: 'error', message: 'No data provided' })
    return
  }

  const dataObj = data as Record<string, unknown>
  logger.info(`Processing ${String(dataObj.type)} log entry`)

  switch (dataObj.type) {
    case 'page-navigated':
      // Handle page navigation event via HTTP POST
      // Note: This is also handled in the WebSocket message handler
      // as the extension may send navigation events through either channel
      logger.info('Received page navigation event with URL:', dataObj.url)
      currentUrl = String(dataObj.url)

      // Also update the tab ID if provided
      if (dataObj.tabId != null) {
        logger.info('Updating tab ID from page navigation event:', dataObj.tabId)
        currentTabId = String(dataObj.tabId)
      }

      logger.info('Updated current URL:', currentUrl)
      break
    case 'console-log':
      logger.info('Adding console log:', {
        level: dataObj.level,
        message:
          String(dataObj.message).substring(0, 100)
          + (String(dataObj.message).length > 100 ? '...' : ''),
        timestamp: dataObj.timestamp,
      })
      consoleLogs.push(dataObj as unknown as LogEntry)
      if (consoleLogs.length > currentSettings.logLimit) {
        logger.info(
          `Console logs exceeded limit (${currentSettings.logLimit}), removing oldest entry`,
        )
        consoleLogs.shift()
      }
      break
    case 'console-error':
      logger.info('Adding console error:', {
        level: dataObj.level,
        message:
          String(dataObj.message).substring(0, 100)
          + (String(dataObj.message).length > 100 ? '...' : ''),
        timestamp: dataObj.timestamp,
      })
      consoleErrors.push(dataObj as unknown as LogEntry)
      if (consoleErrors.length > currentSettings.logLimit) {
        logger.info(
          `Console errors exceeded limit (${currentSettings.logLimit}), removing oldest entry`,
        )
        consoleErrors.shift()
      }
      break
    case 'network-request': {
      const logEntry = {
        url: dataObj.url,
        method: dataObj.method,
        status: dataObj.status,
        timestamp: dataObj.timestamp,
      }
      logger.info('Adding network request:', logEntry)

      // Route network requests based on status code
      const status = Number(dataObj.status)
      if (status >= 400) {
        networkErrors.push(dataObj as unknown as LogEntry)
        if (networkErrors.length > currentSettings.logLimit) {
          logger.info(
            `Network errors exceeded limit (${currentSettings.logLimit}), removing oldest entry`,
          )
          networkErrors.shift()
        }
      } else {
        networkSuccess.push(dataObj as unknown as LogEntry)
        if (networkSuccess.length > currentSettings.logLimit) {
          logger.info(
            `Network success logs exceeded limit (${currentSettings.logLimit}), removing oldest entry`,
          )
          networkSuccess.shift()
        }
      }
      break
    }
    case 'selected-element': {
      const element = dataObj.element as Record<string, unknown> | undefined
      logger.info('Updating selected element:', {
        tagName: element?.tagName as string | undefined,
        id: element?.id as string | undefined,
        className: element?.className as string | undefined,
      })
      selectedElement = element
      break
    }
    default:
      logger.info('Unknown log type:', String(dataObj.type))
  }

  logger.info('Current log counts:', {
    consoleLogs: consoleLogs.length,
    consoleErrors: consoleErrors.length,
    networkErrors: networkErrors.length,
    networkSuccess: networkSuccess.length,
  })
  logger.info('=== End Extension Log ===\n')

  res.json({ status: 'ok' })
})

// Update GET endpoints to use the new function
app.get('/console-logs', (_req, res) => {
  const truncatedLogs = truncateLogsToQueryLimit(consoleLogs)
  res.json(truncatedLogs)
})

app.get('/console-errors', (_req, res) => {
  const truncatedLogs = truncateLogsToQueryLimit(consoleErrors)
  res.json(truncatedLogs)
})

app.get('/network-errors', (_req, res) => {
  const truncatedLogs = truncateLogsToQueryLimit(networkErrors)
  res.json(truncatedLogs)
})

app.get('/network-success', (_req, res) => {
  const truncatedLogs = truncateLogsToQueryLimit(networkSuccess)
  res.json(truncatedLogs)
})

app.get('/all-xhr', (_req, res) => {
  // Merge and sort network success and error logs by timestamp
  const mergedLogs = [...networkSuccess, ...networkErrors].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
  )
  const truncatedLogs = truncateLogsToQueryLimit(mergedLogs)
  res.json(truncatedLogs)
})

// Add new endpoint for selected element
app.post('/selected-element', (req, res) => {
  const bodyObj = req.body as Record<string, unknown>
  selectedElement = bodyObj.data
  res.json({ status: 'ok' })
})

app.get('/selected-element', (_req, res) => {
  res.json(selectedElement != null ? selectedElement : { message: 'No element selected' })
})

app.get('/.port', (_req, res) => {
  res.send(PORT.toString())
})

// Add new identity endpoint with a unique signature
app.get('/.identity', (_req, res) => {
  res.json({
    port: PORT,
    name: 'browser-tools-server',
    version: '1.2.0',
    signature: 'mcp-browser-connector-24x7',
  })
})

// Add function to clear all logs
function clearAllLogs(): void {
  logger.info('Wiping all logs...')
  consoleLogs.length = 0
  consoleErrors.length = 0
  networkErrors.length = 0
  networkSuccess.length = 0
  allXhr.length = 0
  selectedElement = null
  logger.info('All logs have been wiped')
}

// Add endpoint to wipe logs
app.post('/wipelogs', (_req, res) => {
  clearAllLogs()
  res.json({ status: 'ok', message: 'All logs cleared successfully' })
})

// Add endpoint for the extension to report the current URL
app.post('/current-url', (req, res) => {
  logger.info(
    'Received current URL update request:',
    JSON.stringify(req.body, null, 2),
  )

  if (req.body != null && (req.body as Record<string, unknown>).url != null) {
    const oldUrl = currentUrl
    const bodyObj = req.body as Record<string, unknown>
    currentUrl = String(bodyObj.url)

    // Update the current tab ID if provided
    if (bodyObj.tabId != null) {
      const oldTabId = currentTabId
      currentTabId = String(bodyObj.tabId)
      logger.info(`Updated current tab ID: ${oldTabId} -> ${currentTabId}`)
    }

    // Log the source of the update if provided
    const source = bodyObj.source != null ? String(bodyObj.source) : 'unknown'
    const tabId = bodyObj.tabId != null ? String(bodyObj.tabId) : 'unknown'
    const timestamp = bodyObj.timestamp != null
      ? new Date(String(bodyObj.timestamp)).toISOString()
      : 'unknown'

    logger.info(
      `Updated current URL via dedicated endpoint: ${oldUrl} -> ${currentUrl}`,
    )
    logger.info(
      `URL update details: source=${source}, tabId=${tabId}, timestamp=${timestamp}`,
    )

    res.json({
      status: 'ok',
      url: currentUrl,
      tabId: currentTabId,
      previousUrl: oldUrl,
      updated: oldUrl !== currentUrl,
    })
  } else {
    logger.info('No URL provided in current-url request')
    res.status(400).json({ status: 'error', message: 'No URL provided' })
  }
})

// Add endpoint to get the current URL
app.get('/current-url', (_req, res) => {
  logger.info('Current URL requested, returning:', currentUrl)
  res.json({ url: currentUrl })
})

// ScreenshotMessage interface removed - handled directly in WebSocket message handler

interface WebSocketMessage {
  type: string
  data?: string
  url?: string
  tabId?: string | number
  requestId?: string
  error?: string
  path?: string
  autoPaste?: boolean
}

export class BrowserConnector {
  private wss: WebSocketServer
  private activeConnection: WebSocket | null = null
  private app: express.Application
  private server: Server
  private urlRequestCallbacks: Map<string, (url: string) => void> = new Map()

  constructor(app: express.Application, server: Server) {
    this.app = app
    this.server = server

    // Initialize WebSocket server using the existing HTTP server
    this.wss = new WebSocketServer({
      noServer: true,
      path: '/extension-ws',
    })

    // Register the capture-screenshot endpoint
    this.app.post(
      '/capture-screenshot',
      async (req: express.Request, res: express.Response) => {
        logger.info(
          'Browser Connector: Received request to /capture-screenshot endpoint',
        )
        logger.info('Browser Connector: Request body:', req.body)
        logger.info(
          'Browser Connector: Active WebSocket connection:',
          !!this.activeConnection,
        )
        await this.captureScreenshot(req, res)
      },
    )

    // Set up accessibility audit endpoint
    this.setupAccessibilityAudit()

    // Set up performance audit endpoint
    this.setupPerformanceAudit()

    // Set up SEO audit endpoint
    this.setupSEOAudit()

    // Set up Best Practices audit endpoint
    this.setupBestPracticesAudit()

    // Handle upgrade requests for WebSocket
    this.server.on(
      'upgrade',
      (request: IncomingMessage, socket: Socket, head: Buffer) => {
        if (request.url === '/extension-ws') {
          this.wss.handleUpgrade(request, socket, head, (ws: WebSocket) => {
            this.wss.emit('connection', ws, request)
          })
        }
      },
    )

    this.wss.on('connection', (ws: WebSocket) => {
      logger.info('Chrome extension connected via WebSocket')
      this.activeConnection = ws

      ws.on('message', (message: string | Buffer | ArrayBuffer | Buffer[]) => {
        try {
          const rawData: unknown = JSON.parse(message.toString())
          const data = rawData as WebSocketMessage
          // Log message without the base64 data
          logger.info('Received WebSocket message:', {
            ...data,
            data: data.data != null && data.data !== '' ? '[base64 data]' : void 0,
          })

          // Handle URL response
          if (data.type === 'current-url-response' && data.url !== null && data.url !== void 0) {
            logger.info('Received current URL from browser:', data.url)
            currentUrl = String(data.url)

            // Also update the tab ID if provided
            if (data.tabId !== null && data.tabId !== void 0) {
              logger.info(
                'Updating tab ID from WebSocket message:',
                data.tabId,
              )
              currentTabId = String(data.tabId)
            }

            // Call the callback if exists
            if (
              data.requestId !== null && data.requestId !== void 0
              && this.urlRequestCallbacks.has(data.requestId)
            ) {
              const callback = this.urlRequestCallbacks.get(data.requestId)
              if (callback !== null && callback !== void 0) {
                callback(String(data.url))
              }
              this.urlRequestCallbacks.delete(data.requestId)
            }
          }
          // Handle page navigation event via WebSocket
          // Note: This is intentionally duplicated from the HTTP handler in /extension-log
          // as the extension may send navigation events through either channel
          if (data.type === 'page-navigated' && data.url !== null && data.url !== void 0) {
            logger.info('Page navigated to:', data.url)
            currentUrl = String(data.url)

            // Also update the tab ID if provided
            if (data.tabId !== null && data.tabId !== void 0) {
              logger.info(
                'Updating tab ID from page navigation event:',
                data.tabId,
              )
              currentTabId = String(data.tabId)
            }
          }
          // Handle screenshot response
          if (data.type === 'screenshot-data' && data.data !== null && data.data !== void 0) {
            logger.info('Received screenshot data')
            logger.info('Screenshot path from extension:', data.path)
            logger.info('Auto-paste setting from extension:', data.autoPaste)
            // Get the most recent callback since we're not using requestId anymore
            const callbacks = Array.from(screenshotCallbacks.values())
            if (callbacks.length > 0) {
              const callback = callbacks[0]
              logger.info('Found callback, resolving promise')
              // Pass both the data, path and autoPaste to the resolver
              callback.resolve({
                data: data.data,
                path: data.path,
                autoPaste: data.autoPaste,
              })
              // Clear all callbacks
              screenshotCallbacks.clear()
            } else {
              logger.info('No callbacks found for screenshot')
            }
          } else if (data.type === 'screenshot-error') {
            // Handle screenshot error
            logger.info('Received screenshot error:', data.error)
            const callbacks = Array.from(screenshotCallbacks.values())
            if (callbacks.length > 0) {
              const callback = callbacks[0]
              callback.reject(
                new Error(data.error != null && data.error !== '' ? data.error : 'Screenshot capture failed'),
              )
              // Clear all callbacks
              screenshotCallbacks.clear()
            }
          } else {
            logger.info('Unhandled message type:', data.type)
          }
        } catch (error: unknown) {
          logger.error('Error processing WebSocket message:', error)
        }
      })

      ws.on('close', () => {
        logger.info('Chrome extension disconnected')
        if (this.activeConnection === ws) {
          this.activeConnection = null
        }
      })
    })

    // Add screenshot endpoint
    this.app.post(
      '/screenshot',
      (req: express.Request, res: express.Response): void => {
        logger.info(
          'Browser Connector: Received request to /screenshot endpoint',
        )
        logger.info('Browser Connector: Request body:', req.body)
        try {
          logger.info('Received screenshot capture request')
          const { data, path: outputPath } = req.body as { data?: string, path?: string }

          if (data == null) {
            logger.info('Screenshot request missing data')
            res.status(400).json({ error: 'Missing screenshot data' })
            return
          }

          // Use provided path or default to downloads folder
          const targetPath = outputPath != null ? outputPath : getDefaultDownloadsFolder()
          logger.info(`Using screenshot path: ${targetPath}`)

          // Remove the data:image/png;base64, prefix
          const base64Data = String(data).replace(/^data:image\/png;base64,/, '')

          // Create the full directory path if it doesn't exist
          fs.mkdirSync(targetPath, { recursive: true })
          logger.info(`Created/verified directory: ${targetPath}`)

          // Generate a unique filename using timestamp
          const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
          const filename = `screenshot-${timestamp}.png`
          const fullPath = path.join(targetPath, filename)
          logger.info(`Saving screenshot to: ${fullPath}`)

          // Write the file
          fs.writeFileSync(fullPath, base64Data, 'base64')
          logger.info('Screenshot saved successfully')

          res.json({
            path: fullPath,
            filename,
          })
        } catch (error: unknown) {
          logger.error('Error saving screenshot:', error)
          if (error instanceof Error) {
            res.status(500).json({ error: error.message })
          } else {
            res.status(500).json({ error: 'An unknown error occurred' })
          }
        }
      },
    )
  }

  // Note: This method has been superseded by captureScreenshot() method
  // Keeping it for potential future use or backward compatibility
  // private async _handleScreenshot(_req: express.Request, _res: express.Response): Promise<express.Response<any, Record<string, any>> | undefined> {
  //   // Implementation omitted - use captureScreenshot() instead
  // }

  // Updated method to get URL for audits with improved connection tracking and waiting
  private async getUrlForAudit(): Promise<string | null> {
    try {
      logger.info('getUrlForAudit called')

      // Use the stored URL if available immediately
      if (currentUrl != null && currentUrl !== '' && currentUrl !== 'about:blank') {
        logger.info(`Using existing URL immediately: ${currentUrl}`)
        return currentUrl
      }

      // Wait for a URL to become available (retry loop)
      logger.info('No valid URL available yet, waiting for navigation...')

      // Wait up to 10 seconds for a URL to be set (20 attempts x 500ms)
      const maxAttempts = 50
      // ms
      const waitTime = 500

      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        // Check if URL is available now
        if (currentUrl != null && currentUrl !== '' && currentUrl !== 'about:blank') {
          logger.info(`URL became available after waiting:`, currentUrl)
          return currentUrl
        }

        // Wait before checking again
        logger.info(
          `Waiting for URL (attempt ${attempt + 1}/${maxAttempts})...`,
        )
        await new Promise((resolve) => setTimeout(resolve, waitTime))
      }

      // If we reach here, no URL became available after waiting
      logger.info('Timed out waiting for URL, returning null')
      return null
    } catch (error: unknown) {
      logger.error('Error in getUrlForAudit:', error)
      // Return null to trigger an error
      return null
    }
  }

  // Public method to check if there's an active connection
  public hasActiveConnection(): boolean {
    return this.activeConnection != null
  }

  // Add new endpoint for programmatic screenshot capture
  async captureScreenshot(req: express.Request, res: express.Response): Promise<express.Response<any, Record<string, any>> | undefined> {
    logger.info('Browser Connector: Starting captureScreenshot method')
    logger.info('Browser Connector: Request headers:', req.headers)
    logger.info('Browser Connector: Request method:', req.method)

    if (this.activeConnection == null) {
      logger.info(
        'Browser Connector: No active WebSocket connection to Chrome extension',
      )
      return res.status(503).json({ error: 'Chrome extension not connected' })
    }

    try {
      logger.info('Browser Connector: Starting screenshot capture...')
      const requestId = Date.now().toString()
      logger.info('Browser Connector: Generated requestId:', requestId)

      // Create promise that will resolve when we get the screenshot data
      const screenshotPromise = new Promise<{
        data: string
        path?: string
        autoPaste?: boolean
      }>((resolve, reject) => {
        logger.info(
          `Browser Connector: Setting up screenshot callback for requestId: ${requestId}`,
        )
        // Store callback in map
        screenshotCallbacks.set(requestId, { resolve, reject })
        logger.info(
          'Browser Connector: Current callbacks:',
          Array.from(screenshotCallbacks.keys()),
        )

        // Set timeout to clean up if we don't get a response
        setTimeout(() => {
          if (screenshotCallbacks.has(requestId)) {
            logger.info(
              `Browser Connector: Screenshot capture timed out for requestId: ${requestId}`,
            )
            screenshotCallbacks.delete(requestId)
            reject(
              new Error(
                'Screenshot capture timed out - no response from Chrome extension',
              ),
            )
          }
        }, 10000)
      })

      // Send screenshot request to extension
      const message = JSON.stringify({
        type: 'take-screenshot',
        requestId,
      })
      logger.info(
        `Browser Connector: Sending WebSocket message to extension:`,
        message,
      )
      this.activeConnection.send(message)

      // Wait for screenshot data
      logger.info('Browser Connector: Waiting for screenshot data...')
      const {
        data: base64Data,
        path: customPath,
        autoPaste,
      } = await screenshotPromise
      logger.info('Browser Connector: Received screenshot data, saving...')
      logger.info('Browser Connector: Custom path from extension:', customPath)
      logger.info('Browser Connector: Auto-paste setting:', autoPaste)

      // Always prioritize the path from the Chrome extension
      let targetPath = customPath

      // If no path provided by extension, fall back to defaults
      if (targetPath == null) {
        targetPath
          = currentSettings.screenshotPath != null ? currentSettings.screenshotPath : getDefaultDownloadsFolder()
      }

      // Convert the path for the current platform
      targetPath = convertPathForCurrentPlatform(targetPath)

      logger.info(`Browser Connector: Using path: ${targetPath}`)

      if (base64Data == null) {
        throw new Error('No screenshot data received from Chrome extension')
      }

      try {
        fs.mkdirSync(targetPath, { recursive: true })
        logger.info(`Browser Connector: Created directory: ${targetPath}`)
      } catch (err) {
        logger.error(
          `Browser Connector: Error creating directory: ${targetPath}`,
          err,
        )
        throw new Error(
          `Failed to create screenshot directory: ${
            err instanceof Error ? err.message : String(err)
          }`,
        )
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
      const filename = `screenshot-${timestamp}.png`
      const fullPath = path.join(targetPath, filename)
      logger.info(`Browser Connector: Full screenshot path: ${fullPath}`)

      // Remove the data:image/png;base64, prefix if present
      const cleanBase64 = base64Data.replace(/^data:image\/png;base64,/, '')

      // Save the file
      try {
        fs.writeFileSync(fullPath, cleanBase64, 'base64')
        logger.info(`Browser Connector: Screenshot saved to: ${fullPath}`)
      } catch (err) {
        logger.error(
          `Browser Connector: Error saving screenshot to: ${fullPath}`,
          err,
        )
        throw new Error(
          `Failed to save screenshot: ${
            err instanceof Error ? err.message : String(err)
          }`,
        )
      }

      // Check if running on macOS before executing AppleScript
      if (os.platform() === 'darwin' && autoPaste === true) {
        logger.info(
          'Browser Connector: Running on macOS with auto-paste enabled, executing AppleScript to paste into Cursor',
        )

        // Create the AppleScript to copy the image to clipboard and paste into Cursor
        // This version is more robust and includes debugging
        const appleScript = `
          -- Set path to the screenshot
          set imagePath to "${fullPath}"

          -- Copy the image to clipboard
          try
            set the clipboard to (read (POSIX file imagePath) as «class PNGf»)
          on error errMsg
            log "Error copying image to clipboard: " & errMsg
            return "Failed to copy image to clipboard: " & errMsg
          end try

          -- Activate Cursor application
          try
            tell application "Cursor"
              activate
            end tell
          on error errMsg
            log "Error activating Cursor: " & errMsg
            return "Failed to activate Cursor: " & errMsg
          end try

          -- Wait for the application to fully activate
          delay 3

          -- Try to interact with Cursor
          try
            tell application "System Events"
              tell process "Cursor"
                -- Get the frontmost window
                if (count of windows) is 0 then
                  return "No windows found in Cursor"
                end if

                set cursorWindow to window 1

                -- Try Method 1: Look for elements of class "Text Area"
                set foundElements to {}

                -- Try different selectors to find the text input area
                try
                  -- Try with class
                  set textAreas to UI elements of cursorWindow whose class is "Text Area"
                  if (count of textAreas) > 0 then
                    set foundElements to textAreas
                  end if
                end try

                if (count of foundElements) is 0 then
                  try
                    -- Try with AXTextField role
                    set textFields to UI elements of cursorWindow whose role is "AXTextField"
                    if (count of textFields) > 0 then
                      set foundElements to textFields
                    end if
                  end try
                end if

                if (count of foundElements) is 0 then
                  try
                    -- Try with AXTextArea role in nested elements
                    set allElements to UI elements of cursorWindow
                    repeat with anElement in allElements
                      try
                        set childElements to UI elements of anElement
                        repeat with aChild in childElements
                          try
                            if role of aChild is "AXTextArea" or role of aChild is "AXTextField" then
                              set end of foundElements to aChild
                            end if
                          end try
                        end repeat
                      end try
                    end repeat
                  end try
                end if

                -- If no elements found with specific attributes, try a broader approach
                if (count of foundElements) is 0 then
                  -- Just try to use the Command+V shortcut on the active window
                   -- This assumes Cursor already has focus on the right element
                    keystroke "v" using command down
                    delay 1
                    keystroke "here is the screenshot"
                    delay 1
                   -- Try multiple methods to press Enter
                   key code 36 -- Use key code for Return key
                   delay 0.5
                   keystroke return -- Use keystroke return as alternative
                   return "Used fallback method: Command+V on active window"
                else
                  -- We found a potential text input element
                  set inputElement to item 1 of foundElements

                  -- Try to focus and paste
                  try
                    set focused of inputElement to true
                    delay 0.5

                    -- Paste the image
                    keystroke "v" using command down
                    delay 1

                    -- Type the text
                    keystroke "here is the screenshot"
                    delay 1
                    -- Try multiple methods to press Enter
                    key code 36 -- Use key code for Return key
                    delay 0.5
                    keystroke return -- Use keystroke return as alternative
                    return "Successfully pasted screenshot into Cursor text element"
                  on error errMsg
                    log "Error interacting with found element: " & errMsg
                    -- Fallback to just sending the key commands
                    keystroke "v" using command down
                    delay 1
                    keystroke "here is the screenshot"
                    delay 1
                    -- Try multiple methods to press Enter
                    key code 36 -- Use key code for Return key
                    delay 0.5
                    keystroke return -- Use keystroke return as alternative
                    return "Used fallback after element focus error: " & errMsg
                  end try
                end if
              end tell
            end tell
          on error errMsg
            log "Error in System Events block: " & errMsg
            return "Failed in System Events: " & errMsg
          end try
        `

        // Execute the AppleScript
        exec(`osascript -e '${appleScript}'`, (error, stdout, stderr) => {
          if (error) {
            logger.error(
              `Browser Connector: Error executing AppleScript: ${error.message}`,
            )
            logger.error(`Browser Connector: stderr: ${stderr}`)
            // Don't fail the response; log the error and proceed
          } else {
            logger.info(`Browser Connector: AppleScript executed successfully`)
            logger.info(`Browser Connector: stdout: ${stdout}`)
          }
        })
      } else {
        if (os.platform() === 'darwin' && !autoPaste) {
          logger.info(
            `Browser Connector: Running on macOS but auto-paste is disabled, skipping AppleScript execution`,
          )
        } else {
          logger.info(
            `Browser Connector: Not running on macOS, skipping AppleScript execution`,
          )
        }
      }

      res.json({
        path: fullPath,
        filename,
      })
    } catch (error) {
      const errorMessage
        = error instanceof Error ? error.message : String(error)
      logger.error(
        'Browser Connector: Error capturing screenshot:',
        errorMessage,
      )
      res.status(500).json({
        error: errorMessage,
      })
    }
  }

  // Add shutdown method
  public async shutdown(): Promise<void> {
    return new Promise<void>((resolve) => {
      logger.info('Shutting down WebSocket server...')

      // Send close message to client if connection is active
      if (
        this.activeConnection != null
        && this.activeConnection.readyState === WebSocket.OPEN
      ) {
        logger.info('Notifying client to close connection...')
        try {
          this.activeConnection.send(
            JSON.stringify({ type: 'server-shutdown' }),
          )
        } catch (err: unknown) {
          logger.error('Error sending shutdown message to client:', err)
        }
      }

      // Set a timeout to force close after 2 seconds
      const forceCloseTimeout = setTimeout(() => {
        logger.info('Force closing connections after timeout...')
        if (this.activeConnection != null) {
          // Force close the connection
          this.activeConnection.terminate()
          this.activeConnection = null
        }
        this.wss.close()
        resolve()
      }, 2000)

      // Close active WebSocket connection if exists
      if (this.activeConnection != null) {
        this.activeConnection.close(1000, 'Server shutting down')
        this.activeConnection = null
      }

      // Close WebSocket server
      this.wss.close(() => {
        clearTimeout(forceCloseTimeout)
        logger.info('WebSocket server closed gracefully')
        resolve()
      })
    })
  }

  // Sets up the accessibility audit endpoint
  private setupAccessibilityAudit(): void {
    this.setupAuditEndpoint(
      AuditCategory.ACCESSIBILITY,
      '/accessibility-audit',
      runAccessibilityAudit,
    )
  }

  // Sets up the performance audit endpoint
  private setupPerformanceAudit(): void {
    this.setupAuditEndpoint(
      AuditCategory.PERFORMANCE,
      '/performance-audit',
      runPerformanceAudit,
    )
  }

  // Set up SEO audit endpoint
  private setupSEOAudit(): void {
    this.setupAuditEndpoint(AuditCategory.SEO, '/seo-audit', runSEOAudit)
  }

  // Add a setup method for Best Practices audit
  private setupBestPracticesAudit(): void {
    this.setupAuditEndpoint(
      AuditCategory.BEST_PRACTICES,
      '/best-practices-audit',
      runBestPracticesAudit,
    )
  }

  /**
   * Generic method to set up an audit endpoint
   * @param auditType The type of audit (accessibility, performance, SEO)
   * @param endpoint The endpoint path
   * @param auditFunction The audit function to call
   */
  private setupAuditEndpoint(
    auditType: string,
    endpoint: string,
    auditFunction: (url: string) => Promise<LighthouseReport>,
  ): void {
    // Add server identity validation endpoint
    this.app.get('/.identity', (_req, res) => {
      res.json({
        signature: 'mcp-browser-connector-24x7',
        version: '1.2.0',
      })
    })

    this.app.post(endpoint, async (req: express.Request, res: express.Response) => {
      try {
        logger.info(`${auditType} audit request received`)

        // Get URL using our helper method
        const url = await this.getUrlForAudit()

        if (url == null) {
          logger.info(`No URL available for ${auditType} audit`)
          return res.status(400).json({
            error: `URL is required for ${auditType} audit. Make sure you navigate to a page in the browser first, and the browser-tool extension tab is open.`,
          })
        }

        // If we're using the stored URL (not from request body), log it now
        if ((req.body == null || (req.body as Record<string, unknown>)?.url == null) && url === currentUrl) {
          logger.info(`Using stored URL for ${auditType} audit:`, url)
        }

        // Check if we're using the default URL
        if (url === 'about:blank') {
          logger.info(`Cannot run ${auditType} audit on about:blank`)
          return res.status(400).json({
            error: `Cannot run ${auditType} audit on about:blank`,
          })
        }

        logger.info(`Preparing to run ${auditType} audit for: ${url}`)

        // Run the audit using the provided function
        try {
          const result = await auditFunction(url)

          logger.info(`${auditType} audit completed successfully`)
          // Return the results
          res.json(result)
        } catch (auditError: unknown) {
          logger.error(`${auditType} audit failed:`, auditError)
          const errorMessage
            = auditError instanceof Error
              ? auditError.message
              : String(auditError)
          res.status(500).json({
            error: `Failed to run ${auditType} audit: ${errorMessage}`,
          })
        }
      } catch (error: unknown) {
        logger.error(`Error in ${auditType} audit endpoint:`, error)
        const errorMessage
          = error instanceof Error ? error.message : String(error)
        res.status(500).json({
          error: `Error in ${auditType} audit endpoint: ${errorMessage}`,
        })
      }
    })
  }
}

// Use an async IIFE to allow for async/await in the initial setup
(async () => {
  try {
    logger.info(`Starting Browser Tools Server...`)
    logger.info(`Requested port: ${REQUESTED_PORT}`)

    // Find an available port
    try {
      PORT = await getAvailablePort(REQUESTED_PORT)

      if (PORT !== REQUESTED_PORT) {
        logger.info(`\n====================================`)
        logger.info(`NOTICE: Requested port ${REQUESTED_PORT} was in use.`)
        logger.info(`Using port ${PORT} instead.`)
        logger.info(`====================================\n`)
      }
    } catch (portError: unknown) {
      logger.error(`Failed to find an available port:`, portError)
      process.exit(1)
    }

    // Create the server with the available port
    const server = app.listen(PORT, currentSettings.serverHost, () => {
      logger.info(`\n=== Browser Tools Server Started ===`)
      logger.info(
        `Aggregator listening on http://${currentSettings.serverHost}:${PORT}`,
      )

      if (PORT !== REQUESTED_PORT) {
        logger.info(
          `NOTE: Using fallback port ${PORT} instead of requested port ${REQUESTED_PORT}`,
        )
      }

      // Log all available network interfaces for easier discovery
      const networkInterfaces = os.networkInterfaces()
      logger.info('\nAvailable on the following network addresses:')

      Object.keys(networkInterfaces).forEach((interfaceName) => {
        const interfaces = networkInterfaces[interfaceName]
        if (interfaces) {
          interfaces.forEach((iface: NetworkInterface) => {
            if (!iface.internal && iface.family === 'IPv4') {
              logger.info(`  - http://${iface.address}:${PORT}`)
            }
          })
        }
      })

      logger.info(`\nFor local access use: http://localhost:${PORT}`)
    })

    // Handle server startup errors
    server.on('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE') {
        logger.error(
          `ERROR: Port ${PORT} is still in use, despite our checks!`,
        )
        logger.error(
          `This might indicate another process started using this port after our check.`,
        )
      } else {
        logger.error(`Server error:`, err)
      }
      process.exit(1)
    })

    // Initialize the browser connector with the existing app AND server
    const browserConnector = new BrowserConnector(app, server)
    const fn = async (): Promise<void> => {
      logger.info('\nReceived SIGINT signal. Starting graceful shutdown...')
      try {
        // First shutdown WebSocket connections
        await browserConnector.shutdown()

        // Then close the HTTP server
        await new Promise<void>((resolve, reject) => {
          server.close((err) => {
            if (err) {
              logger.error('Error closing HTTP server:', err)
              reject(err)
            } else {
              logger.info('HTTP server closed successfully')
              resolve()
            }
          })
        })

        // Clear all logs
        clearAllLogs()

        logger.info('Shutdown completed successfully')
        process.exit(0)
      } catch (error: unknown) {
        logger.error('Error during shutdown:', error)
        // Force exit in case of error
        process.exit(1)
      }
    }
    // Handle shutdown gracefully with improved error handling
    process.on('SIGINT', () => {
      void fn()
    })

    // Also handle SIGTERM
    process.on('SIGTERM', () => {
      logger.info('\nReceived SIGTERM signal')
      process.emit('SIGINT')
    })
  } catch (error: unknown) {
    logger.error('Failed to start server:', error)
    process.exit(1)
  }
})().catch((err: unknown) => {
  logger.error('Unhandled error during server startup:', err)
  process.exit(1)
})

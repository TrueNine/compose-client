import type {ApiResponse, ServerConnection} from '@/types'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import {
  DEFAULT_HOST,
  DEFAULT_PORT,
  DISCOVERY_TIMEOUT,
  PORT_RANGE_END,
  PORT_RANGE_START,
  SERVER_SIGNATURE,
} from '@/config/constants'
import {logger} from '@/logger'

let discoveredHost = DEFAULT_HOST
let discoveredPort = DEFAULT_PORT
let serverDiscovered = false

export function getDefaultServerPort(): number {
  if (process.env.BROWSER_TOOLS_PORT != null) {
    const envPort = Number.parseInt(process.env.BROWSER_TOOLS_PORT, 10)
    if (!Number.isNaN(envPort) && envPort > 0) return envPort
  }

  try {
    const portFilePath = path.join(__dirname, '.port')
    if (fs.existsSync(portFilePath)) {
      const port = Number.parseInt(fs.readFileSync(portFilePath, 'utf8').trim(), 10)
      if (!Number.isNaN(port) && port > 0) return port
    }
  } catch (err) {
    logger.error('Error reading port file:', err)
  }

  return DEFAULT_PORT
}

export function getDefaultServerHost(): string {
  if (process.env.BROWSER_TOOLS_HOST != null) return process.env.BROWSER_TOOLS_HOST
  return DEFAULT_HOST
}

export async function discoverServer(): Promise<boolean> {
  logger.info('Starting server discovery process')

  const hosts = [getDefaultServerHost(), DEFAULT_HOST, 'localhost']
  const defaultPort = getDefaultServerPort()
  const ports = [defaultPort]

  for (let p = PORT_RANGE_START; p <= PORT_RANGE_END; p++) {
    if (p !== defaultPort) ports.push(p)
  }

  logger.info(`Will try hosts: ${hosts.join(', ')}`)
  logger.info(`Will try ports: ${ports.join(', ')}`)

  for (const host of hosts) {
    for (const port of ports) {
      try {
        logger.info(`Checking ${host}:${port}...`)

        const response = await fetch(`http://${host}:${port}/.identity`, {
          signal: AbortSignal.timeout(DISCOVERY_TIMEOUT),
        })

        if (response.ok) {
          const identity = await response.json() as ApiResponse

          if (identity.signature === SERVER_SIGNATURE) {
            logger.info(`Successfully found server at ${host}:${port}`)

            discoveredHost = host
            discoveredPort = port
            serverDiscovered = true

            return true
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        logger.error(`Error checking ${host}:${port}: ${errorMessage}`)
      }
    }
  }

  logger.error('No server found during discovery')
  return false
}

export async function withServerConnection<T>(
  apiCall: () => Promise<T>,
): Promise<T> {
  if (!serverDiscovered) {
    const discovered = await discoverServer()
    if (!discovered) {
      return {
        content: [
          {
            type: 'text',
            text: 'Failed to discover browser connector server. Please ensure it\'s running.',
          },
        ],
        isError: true,
      } as T
    }
  }

  try {
    return await apiCall()
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error(
      `API call failed: ${errorMessage}. Attempting rediscovery...`,
    )
    serverDiscovered = false

    if (await discoverServer()) {
      logger.error('Rediscovery successful. Retrying API call...')
      try {
        return await apiCall()
      } catch (retryError) {
        const retryErrorMessage = retryError instanceof Error ? retryError.message : String(retryError)
        logger.error(`Retry failed: ${retryErrorMessage}`)
        return {
          content: [
            {
              type: 'text',
              text: `Error after reconnection attempt: ${retryErrorMessage}`,
            },
          ],
          isError: true,
        } as T
      }
    } else {
      logger.error('Rediscovery failed. Could not reconnect to server.')
      return {
        content: [
          {
            type: 'text',
            text: `Failed to reconnect to server: ${errorMessage}`,
          },
        ],
        isError: true,
      } as T
    }
  }
}

export function getDiscoveredConnection(): ServerConnection {
  return {host: discoveredHost, port: discoveredPort, discovered: serverDiscovered}
}

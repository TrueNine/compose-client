#!/usr/bin/env node

import process from 'node:process'
import {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js'
import {StdioServerTransport} from '@modelcontextprotocol/sdk/server/stdio.js'
import {logger} from '@/logger'
import {registerAuditTools} from '@/tools/audit-tools'
import {registerBrowserTools} from '@/tools/browser-tools'
import {registerCompositeTools} from '@/tools/composite-tools'
import {registerLoggingTools} from '@/tools/logging-tools'
import {discoverServer} from '@/utils/server-discovery'

const server = new McpServer({name: 'Browseruse MCP', version: '0.0.1'})

registerLoggingTools(server)
registerBrowserTools(server)
registerAuditTools(server)
registerCompositeTools(server)

async function main(): Promise<void> {
  try {
    logger.error('Attempting initial server discovery on startup...')
    const discovered = await discoverServer()

    if (discovered) logger.error('Successfully discovered server on startup')
    else logger.error('Initial server discovery failed. Will try again when tools are used.')

    const transport = new StdioServerTransport()

    const originalStdoutWrite = process.stdout.write.bind(process.stdout)

    process.stdout.write = (chunk: any, encoding?: any, callback?: any): boolean => {
      if (typeof chunk === 'string' && !chunk.startsWith('{')) return true
      // eslint-disable-next-line ts/no-unsafe-argument
      return originalStdoutWrite(chunk, encoding, callback)
    }

    await server.connect(transport)
  } catch (error) {
    logger.error('Failed to initialize MCP server:', error)
    process.exit(1)
  }
}

main().catch((error: unknown) => {
  logger.error('Unhandled error in main:', error)
  process.exit(1)
})

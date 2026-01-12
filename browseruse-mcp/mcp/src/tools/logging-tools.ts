import type {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js'
import type {ApiResponse, McpToolResponse} from '@/types'
import {getDiscoveredConnection, withServerConnection} from '@/utils/server-discovery'

export function registerLoggingTools(server: McpServer): void {
  server.tool('getConsoleLogs', 'Check our browser logs', {}, async () => withServerConnection(async (): Promise<McpToolResponse> => {
    try {
      const {host, port} = getDiscoveredConnection()
      const response = await fetch(`http://${host}:${port}/logger-logs`)
      const json = await response.json() as ApiResponse

      return {content: [
        {type: 'text', text: JSON.stringify(json, null, 2)},
      ]}
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      return {content: [
        {type: 'text', text: `Failed to get console logs: ${errorMessage}`},
      ]}
    }
  }))

  server.tool('getConsoleErrors', 'Check our browsers logger errors', {}, async () => withServerConnection(async (): Promise<McpToolResponse> => {
    try {
      const {host, port} = getDiscoveredConnection()
      const response = await fetch(`http://${host}:${port}/logger-errors`)
      const json = await response.json() as ApiResponse

      return {content: [
        {type: 'text', text: JSON.stringify(json, null, 2)},
      ]}
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      return {content: [
        {type: 'text', text: `Failed to get console errors: ${errorMessage}`},
      ]}
    }
  }))

  server.tool('getNetworkErrors', 'Check our network ERROR logs', {}, async () => withServerConnection(async (): Promise<McpToolResponse> => {
    try {
      const {host, port} = getDiscoveredConnection()
      const response = await fetch(`http://${host}:${port}/network-errors`)
      const json = await response.json() as ApiResponse

      return {content: [
        {type: 'text', text: JSON.stringify(json, null, 2)},
      ], isError: true}
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      return {content: [
        {type: 'text', text: `Failed to get network errors: ${errorMessage}`},
      ], isError: true}
    }
  }))

  server.tool('getNetworkLogs', 'Check ALL our network logs', {}, async () => withServerConnection(async (): Promise<McpToolResponse> => {
    try {
      const {host, port} = getDiscoveredConnection()
      const response = await fetch(`http://${host}:${port}/network-success`)
      const json = await response.json() as ApiResponse

      return {content: [
        {type: 'text', text: JSON.stringify(json, null, 2)},
      ]}
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      return {content: [
        {type: 'text', text: `Failed to get network logs: ${errorMessage}`},
      ]}
    }
  }))
}

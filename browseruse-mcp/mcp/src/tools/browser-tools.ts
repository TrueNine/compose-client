import type {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js'
import type {ApiResponse, McpToolResponse} from '@/types'
import {getDiscoveredConnection, withServerConnection} from '@/utils/server-discovery'

export function registerBrowserTools(server: McpServer): void {
  server.tool('takeScreenshot', 'Take a screenshot of the current browser tab', {}, async () => withServerConnection(async (): Promise<McpToolResponse> => {
    try {
      const {host, port} = getDiscoveredConnection()
      const response = await fetch(`http://${host}:${port}/capture-screenshot`, {method: 'POST'})

      const result = await response.json() as ApiResponse

      return response.ok
        ? {content: [
            {type: 'text', text: 'Successfully saved screenshot'},
          ]}
        : {content: [
            {type: 'text', text: `Error taking screenshot: ${result.error ?? 'Unknown error'}`},
          ]}
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      return {content: [
        {type: 'text', text: `Failed to take screenshot: ${errorMessage}`},
      ]}
    }
  }))

  server.tool('getSelectedElement', 'Get the selected element from the browser', {}, async () => withServerConnection(async (): Promise<McpToolResponse> => {
    try {
      const {host, port} = getDiscoveredConnection()
      const response = await fetch(`http://${host}:${port}/selected-element`)
      const json = await response.json() as ApiResponse

      return {content: [
        {type: 'text', text: JSON.stringify(json, null, 2)},
      ]}
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      return {content: [
        {type: 'text', text: `Failed to get selected element: ${errorMessage}`},
      ]}
    }
  }))

  server.tool('wipeLogs', 'Wipe all browser logs from memory', {}, async () => withServerConnection(async (): Promise<McpToolResponse> => {
    try {
      const {host, port} = getDiscoveredConnection()
      const response = await fetch(`http://${host}:${port}/wipelogs`, {method: 'POST'})
      const json = await response.json() as ApiResponse

      return {content: [
        {type: 'text', text: json.message ?? 'Logs wiped'},
      ]}
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      return {content: [
        {type: 'text', text: `Failed to wipe logs: ${errorMessage}`},
      ]}
    }
  }))
}

import type {McpServer} from '@modelcontextprotocol/sdk/server/mcp.js'
import type {ApiResponse, AuditRequest, McpToolResponse} from '@/types'
import {AuditCategory} from '@/config/constants'
import {logger} from '@/logger'
import {getDiscoveredConnection, withServerConnection} from '@/utils/server-discovery'

export function registerAuditTools(server: McpServer): void {
  server.tool('runAccessibilityAudit', 'Run an accessibility audit on the current page', {}, async () => withServerConnection(async (): Promise<McpToolResponse> => {
    try {
      const {host, port} = getDiscoveredConnection()
      logger.info(`Sending POST request to http://${host}:${port}/accessibility-audit`)

      const requestBody: AuditRequest = {category: AuditCategory.ACCESSIBILITY, source: 'mcp_tool', timestamp: Date.now()}

      const response = await fetch(
        `http://${host}:${port}/accessibility-audit`,
        {method: 'POST', headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}, body: JSON.stringify(requestBody)},
      )

      logger.info(`Accessibility audit response status: ${response.status}`)

      if (!response.ok) {
        const errorText = await response.text()
        logger.error(`Accessibility audit error: ${errorText}`)
        throw new Error(`Server returned ${response.status}: ${errorText}`)
      }

      const json = await response.json() as ApiResponse

      // eslint-disable-next-line ts/strict-boolean-expressions
      if (json.report) {
        // eslint-disable-next-line ts/no-unsafe-assignment
        const {metadata} = json as any
        // eslint-disable-next-line ts/no-unsafe-assignment
        const {report} = json as any
        // eslint-disable-next-line ts/no-unsafe-assignment
        const flattened = {...metadata, ...report}

        return {content: [
          {type: 'text', text: JSON.stringify(flattened, null, 2)},
        ]}
      }
      return {content: [
        {type: 'text', text: JSON.stringify(json, null, 2)},
      ]}
    }
    catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      logger.error('Error in accessibility audit:', errorMessage)
      return {content: [
        {type: 'text', text: `Failed to run accessibility audit: ${errorMessage}`},
      ]}
    }
  }))

  server.tool('runPerformanceAudit', 'Run a performance audit on the current page', {}, async () => withServerConnection(async (): Promise<McpToolResponse> => {
    try {
      const {host, port} = getDiscoveredConnection()
      logger.info(`Sending POST request to http://${host}:${port}/performance-audit`)

      const requestBody: AuditRequest = {category: AuditCategory.PERFORMANCE, source: 'mcp_tool', timestamp: Date.now()}

      const response = await fetch(
        `http://${host}:${port}/performance-audit`,
        {method: 'POST', headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}, body: JSON.stringify(requestBody)},
      )

      logger.info(`Performance audit response status: ${response.status}`)

      if (!response.ok) {
        const errorText = await response.text()
        logger.error(`Performance audit error: ${errorText}`)
        throw new Error(`Server returned ${response.status}: ${errorText}`)
      }

      const json = await response.json() as ApiResponse

      // eslint-disable-next-line ts/strict-boolean-expressions
      if (json.report) {
        // eslint-disable-next-line ts/no-unsafe-assignment
        const {metadata} = json as any
        // eslint-disable-next-line ts/no-unsafe-assignment
        const {report} = json as any
        // eslint-disable-next-line ts/no-unsafe-assignment
        const flattened = {...metadata, ...report}

        return {content: [
          {type: 'text', text: JSON.stringify(flattened, null, 2)},
        ]}
      }
      return {content: [
        {type: 'text', text: JSON.stringify(json, null, 2)},
      ]}
    }
    catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      logger.error('Error in performance audit:', errorMessage)
      return {content: [
        {type: 'text', text: `Failed to run performance audit: ${errorMessage}`},
      ]}
    }
  }))

  server.tool('runSEOAudit', 'Run an SEO audit on the current page', {}, async () => withServerConnection(async (): Promise<McpToolResponse> => {
    try {
      const {host, port} = getDiscoveredConnection()
      logger.info(`Sending POST request to http://${host}:${port}/seo-audit`)

      const requestBody: AuditRequest = {category: AuditCategory.SEO, source: 'mcp_tool', timestamp: Date.now()}

      const response = await fetch(
        `http://${host}:${port}/seo-audit`,
        {method: 'POST', headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}, body: JSON.stringify(requestBody)},
      )

      logger.info(`SEO audit response status: ${response.status}`)

      if (!response.ok) {
        const errorText = await response.text()
        logger.error(`SEO audit error: ${errorText}`)
        throw new Error(`Server returned ${response.status}: ${errorText}`)
      }

      const json = await response.json() as ApiResponse

      return {content: [
        {type: 'text', text: JSON.stringify(json, null, 2)},
      ]}
    }
    catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      logger.error('Error in SEO audit:', errorMessage)
      return {content: [
        {type: 'text', text: `Failed to run SEO audit: ${errorMessage}`},
      ]}
    }
  }))

  server.tool('runBestPracticesAudit', 'Run a best practices audit on the current page', {}, async () => withServerConnection(async (): Promise<McpToolResponse> => {
    try {
      const {host, port} = getDiscoveredConnection()
      logger.info(`Sending POST request to http://${host}:${port}/best-practices-audit`)

      const requestBody: Omit<AuditRequest, 'category'> = {source: 'mcp_tool', timestamp: Date.now()}

      const response = await fetch(
        `http://${host}:${port}/best-practices-audit`,
        {method: 'POST', headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}, body: JSON.stringify(requestBody)},
      )

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Server returned ${response.status}: ${errorText}`)
      }

      const json = await response.json() as ApiResponse

      // eslint-disable-next-line ts/strict-boolean-expressions
      if (json.report) {
        // eslint-disable-next-line ts/no-unsafe-assignment
        const {metadata} = json as any
        // eslint-disable-next-line ts/no-unsafe-assignment
        const {report} = json as any
        // eslint-disable-next-line ts/no-unsafe-assignment
        const flattened = {...metadata, ...report}

        return {content: [
          {type: 'text', text: JSON.stringify(flattened, null, 2)},
        ]}
      }
      return {content: [
        {type: 'text', text: JSON.stringify(json, null, 2)},
      ]}
    }
    catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      logger.error('Error in Best Practices audit:', errorMessage)
      return {content: [
        {type: 'text', text: `Failed to run Best Practices audit: ${errorMessage}`},
      ]}
    }
  }))
}

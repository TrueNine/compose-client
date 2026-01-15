export interface McpToolResponse { // MCP Tool Response Types
  [x: string]: unknown
  content: {
    type: 'text'
    text: string
    [key: string]: unknown
  }[]
  isError?: boolean
}

export interface ServerConnection { // Server Discovery Types
  host: string
  port: number
  discovered: boolean
}

export interface ApiResponse { // API Response Types
  error?: string
  message?: string
  report?: unknown
  metadata?: unknown
  [key: string]: unknown
}

export interface AuditRequest { // Audit Types
  category?: string
  source: string
  timestamp: number
}

export interface LogEntry { // Logger Types
  level: string
  message: string
  timestamp: number
  [key: string]: unknown
} // We don't need this type anymore - removed due to complexity

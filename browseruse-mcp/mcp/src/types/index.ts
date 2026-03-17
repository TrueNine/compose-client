export interface McpToolResponse { // MCP Tool Response Types
  [x: string]: unknown
  content: {
    [key: string]: unknown
    type: 'text'
    text: string
  }[]
  isError?: boolean
}

export interface ServerConnection { // Server Discovery Types
  host: string
  port: number
  discovered: boolean
}

export interface ApiResponse { // API Response Types
  [key: string]: unknown
  error?: string
  message?: string
  metadata?: unknown
  report?: unknown
}

export interface AuditRequest { // Audit Types
  category?: string
  source: string
  timestamp: number
}

export interface LogEntry { // Logger Types
  [key: string]: unknown
  level: string
  message: string
  timestamp: number
} // We don't need this type anymore - removed due to complexity

// MCP Tool Response Types
export interface McpToolResponse {
  [x: string]: unknown
  content: Array<{
    type: 'text'
    text: string
    [key: string]: unknown
  }>
  isError?: boolean
}

// Server Discovery Types
export interface ServerConnection {
  host: string
  port: number
  discovered: boolean
}

// API Response Types
export interface ApiResponse {
  error?: string
  message?: string
  report?: unknown
  metadata?: unknown
  [key: string]: unknown
}

// Audit Types
export interface AuditRequest {
  category?: string
  source: string
  timestamp: number
}

// Logger Types
export interface LogEntry {
  level: string
  message: string
  timestamp: number
  [key: string]: unknown
}

// We don't need this type anymore - removed due to complexity

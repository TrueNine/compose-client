# BrowserUse MCP Server

A Model Context Protocol (MCP) server that provides browser automation and web performance auditing capabilities through Puppeteer and Lighthouse integration.

## Features

- **Browser Automation**: Puppeteer-based browser control and automation
- **Performance Auditing**: Lighthouse integration for web performance analysis
- **Real-time Logging**: Comprehensive logging system with configurable levels
- **Multi-browser Support**: Chrome, Edge, Brave, and Firefox compatibility
- **WebSocket API**: Real-time communication for browser interactions
- **REST API**: HTTP endpoints for programmatic access

## Quick Start

### Installation

```bash
npm install @truenine/browseruse-server
```

### Usage

#### As CLI Tool
```bash
npx -y @truenine/browseruse-server
```

#### Programmatic Usage
```javascript
import { BrowserConnector } from '@truenine/browseruse-server'

const connector = new BrowserConnector()
await connector.start()
```

## API Features

### Lighthouse Audits
- **Performance**: Core Web Vitals, loading metrics
- **Accessibility**: WCAG compliance checks
- **SEO**: Search engine optimization analysis
- **Best Practices**: Security and modern web standards

### Browser Operations
- Page navigation and interaction
- Screenshot capture
- Network monitoring
- Console log collection

## Configuration

The server supports various configuration options including:
- Browser preferences and paths
- Connection timeouts and retry limits
- Logging levels and output formats
- Screenshot storage paths

## Requirements

- Node.js ≥18.0.0
- Chrome, Chromium, or compatible browser

## License

LGPL-2.1-or-later

## Repository

[GitHub Repository](https://github.com/TrueNine/compose-client)

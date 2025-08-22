# Compose-Client

A comprehensive frontend development toolkit featuring Vue3 components, utilities, and platform SDKs.

## Features

- 🎨 **Vue3 Component Library** - Rich UI components based on Element Plus, Vuetify, and Varlet
- 🛠️ **Development Tools** - Shared utilities, type definitions, and external library wrappers
- 🌐 **Platform SDKs** - Tencent Maps and WeChat Public Account integrations
- 🔧 **Build Configurations** - Pre-configured ESLint, TypeScript, UnoCSS, and Vite setups
- 🧩 **Browser Extensions** - Chrome extension development tools
- 📦 **Monorepo Architecture** - PNPM workspace with Turbo build system

## Build Environment

- **Node.js**: 24.5.0+
- **PNPM**: 10.15.0+
- **Turbo**: 2.5.6+
- **TypeScript**: 5.9.2+

## Quick Start

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Start development servers
pnpm dev
```

## Project Structure

```
compose-client/
├── configs/                      # Build and development tool configurations
│   ├── eslint9/                  # ESLint 9 configuration package
│   ├── tsconfig/                 # TypeScript configuration package
│   ├── uno/                      # UnoCSS configuration package
│   └── vite/                     # Vite build configuration package
├── types/                        # Global type definitions and utilities
├── shared/                       # Common utility functions and constants
├── vue/                          # Vue3 base tools and installers
├── external/                     # Third-party library wrappers
├── ui/                           # Vue3 component library
├── design/                       # Designer system components
├── req/                          # Network request utilities
├── psdk/                         # Platform SDKs
│   ├── tmap/                     # Tencent Maps SDK
│   └── wxpa/                     # WeChat Public Account SDK
├── ext/                          # Browser extensions
│   └── chrome/                   # Chrome extension tools
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── vitest.workspace.ts
```

## Available Scripts

### Root Level Commands
```bash
pnpm build       # Build all packages
pnpm test        # Run tests for all packages
pnpm lint        # Run lint checks for all packages
pnpm type-check  # Run type checking for all packages
pnpm dev         # Start development servers
```

### Package-Specific Commands
```bash
# Build specific package
turbo run build --filter=@truenine/ui

# Test specific package
turbo run test --filter=@truenine/shared

# Start development server for UI package
turbo run dev --filter=@truenine/ui
```

## Packages

### Core Packages

- **[@truenine/types](./types)** - Global TypeScript type definitions
- **[@truenine/shared](./shared)** - Common utility functions and constants
- **[@truenine/vue](./vue)** - Vue3 base tools and installers
- **[@truenine/external](./external)** - Third-party library wrappers

### UI & Design

- **[@truenine/ui](./ui)** - Vue3 component library with playground
- **[@truenine/design](./design)** - AI-powered design system components

### Platform Integration

- **[@truenine/req](./req)** - Network request utilities based on ky
- **[@truenine/psdk-tmap](./psdk/tmap)** - Tencent Maps SDK
- **[@truenine/psdk-wxpa](./psdk/wxpa)** - WeChat Public Account SDK

### Development Tools

- **[@truenine/eslint9-config](./configs/eslint9)** - ESLint 9 configuration
- **[@truenine/tsconfig](./configs/tsconfig)** - TypeScript configuration
- **[@truenine/config-uno](./configs/uno)** - UnoCSS configuration
- **[@truenine/config-vite](./configs/vite)** - Vite build configuration

### Extensions

- **[@truenine/ext-chrome](./ext/chrome)** - Chrome browser extension tools

## Development

This project uses:

- **PNPM Workspace** for monorepo management
- **Turbo** for build orchestration and caching
- **TSDown** for TypeScript compilation
- **Vite** for modern build tooling
- **Vitest** for unit testing
- **PNPM Catalog** for unified dependency management

All packages are published as ESM modules with TypeScript support.

## Testing

```bash
# Run all tests
pnpm test

# Run tests for specific package
turbo run test --filter=package-name

# Run tests in watch mode
cd packages/package-name && npx vitest watch
```

## License

This project is licensed under [LGPL-2.1-or-later](./LICENSE).

## Contributing

Please ensure all contributions follow the established code standards and include appropriate tests.
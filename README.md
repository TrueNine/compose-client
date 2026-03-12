# Compose-Client

Modern Frontend Development Toolkit - Vue3-based comprehensive frontend solutions

## Project Overview

Compose-Client is a comprehensive frontend development toolkit built on Monorepo architecture, providing full-stack frontend solutions from UI components to platform SDKs.

## 🎯 Core Features

- 🎨 **Vue3 Component Library** - Rich UI components based on Element Plus, Vuetify, Varlet
- 🛠️ **Development Toolkit** - Unified build configurations, type definitions and utility functions
- 🌐 **Platform SDK Integration** - Mainstream platform SDKs including Tencent Maps, WeChat Public Account
- 🔧 **Modern Build System** - TypeScript + ESM with dual format output support
- 🧩 **Browser Extensions** - Chrome extension development tools
- 📦 **Monorepo Architecture** - PNPM Workspace + Turbo build system

## 🚀 Tech Stack

- **Node.js**: 24.5.0+
- **PNPM**: 10.15.0+ 
- **Turbo**: 2.5.6+
- **TypeScript**: 5.9.2+
- **Build Tools**: TSDown + Vite + Vitest
- **CSS Framework**: UnoCSS + SCSS
- **Package Management**: PNPM Catalog unified version management

## ⚡ Quick Start

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm build

# Run tests
pnpm test

# Start development servers
pnpm dev

# Type checking
pnpm typecheck

# Lint checks
pnpm lint:fix
```

## 📁 Project Structure

```
compose-client/
├── configs/                    # Build and development tool configurations
│   ├── eslint9/               # ESLint 9 configuration package
│   ├── tsconfig/              # TypeScript configuration package
│   ├── uno/                   # UnoCSS configuration package
│   └── vite/                  # Vite build configuration package
├── types/                     # Global type definitions and TypeScript utilities
├── shared/                    # Common utility functions and constants
├── vue/                       # Vue3 base tools and installers
├── external/                  # Third-party library wrappers (dayjs, lodash-es, vue-router, etc.)
├── ui/                        # Vue3 component library (with playground)
├── design/                    # Design system components (with playground)
├── req/                       # Network request utilities (based on ky)
├── psdk/                      # Platform SDK integrations
│   ├── tmap/                  # Tencent Maps SDK
│   └── wxpa/                  # WeChat Public Account SDK
├── ext/                       # Browser extensions
│   └── chrome/                # Chrome extension tools
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── vitest.workspace.ts
```

## 📦 Core Packages

### 🔧 Configuration Packages
- **[@truenine/eslint9-config](./configs/eslint9)** - Unified ESLint 9 configuration
- **[@truenine/tsconfig](./configs/tsconfig)** - TypeScript configuration presets
- **[@truenine/config-uno](./configs/uno)** - UnoCSS configuration and themes
- **[@truenine/config-vite](./configs/vite)** - Vite build configuration

### 🏗️ Foundation Libraries
- **[@truenine/types](./types)** - Global TypeScript type definitions
- **[@truenine/shared](./shared)** - Common utility functions and constants
- **[@truenine/vue](./vue)** - Vue3 base tools and installers
- **[@truenine/external](./external)** - Unified third-party library wrappers

### 🎨 UI Components
- **[@truenine/ui](./ui)** - Vue3 component library integrating Element Plus, Vuetify, Varlet
- **[@truenine/design](./design)** - AI-driven design system components

### 🌐 Network and Platform
- **[@truenine/req](./req)** - Network request utilities based on ky
- **[@truenine/psdk-tmap](./psdk/tmap)** - Tencent Maps SDK wrapper
- **[@truenine/psdk-wxpa](./psdk/wxpa)** - WeChat Public Account SDK wrapper

### 🧩 Extension Tools
- **[@truenine/ext-chrome](./ext/chrome)** - Chrome browser extension development tools

## 🔨 Development Commands

### Root Level Commands
```bash
# Build related
pnpm build                     # Build all packages
pnpm build:fast               # Force fast build
pnpm build:legacy             # Concurrent build (12 tasks)

# Test related
pnpm test                     # Run all tests
pnpm test:legacy              # Concurrent testing (10 tasks)

# Code quality
pnpm lint:fix                    # Lint checks
pnpm typecheck              # Type checking
pnpm lint:fix:root              # Root directory lint check

# Development servers
pnpm dev                      # Start all development servers
pnpm dev:single              # Single task startup
pnpm dev:legacy              # Concurrent startup (6 tasks)

# CI related
pnpm ci:build                # CI build (includes all checks)
pnpm ci:quick                # CI quick check (excludes tests)
```

### Package Level Commands
```bash
# Build specific package
turbo run build --filter=@truenine/ui
turbo run build --filter=package-name

# Test specific package
turbo run test --filter=@truenine/shared
cd packages/package-name && npx vitest watch

# Start development server (ui, design packages only)
turbo run dev --filter=@truenine/ui
turbo run dev --filter=@truenine/design
```

## 🏗️ Build System

### Build Tools
- **TSDown**: TypeScript compilation (configs, shared, types, req, vue, external, psdk, ext)
- **Vite**: Modern build tool (ui, design packages with playground)
- **Gulp**: CSS post-processing (style optimization for ui, design packages)
- **Turbo**: Task orchestration and caching

### Build Dependencies
- **build**: depends on typecheck, lint:fix, ^build
- **build-c**: compilation step, depends on ^build
- **build-g**: post-processing step, depends on build-c
- **test**: depends on ^build, typecheck, lint:fix
- **lint:fix**: depends on ^build
- **typecheck**: no dependencies, can run in parallel

### Output Formats
- **TSDown packages**: Generate ESM + CJS dual format with sourcemap and dts files
- **Vite packages**: Generate ESM format with CSS extraction and Gulp post-processing

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Test specific package
turbo run test --filter=package-name

# Run specific test file
cd packages/package-name && npx vitest run path/to/test.spec.ts

# Run tests in watch mode
cd packages/package-name && npx vitest watch path/to/test.spec.ts
```

### Test Environment
- **Testing Framework**: Vitest + jsdom environment
- **Component Testing**: @vue/test-utils
- **Configuration Files**: Root level vitest.workspace.ts + individual package vitest.config.ts
- **Test Directories**: `__tests__/` directories or `.spec.ts` suffix files

## 🎮 Playground

ui and design packages contain playground directories for development debugging:

```bash
# Start UI component playground
turbo run dev --filter=@truenine/ui

# Start design system playground
turbo run dev --filter=@truenine/design
```

Playgrounds use Vue Router for page management, providing component preview and debugging functionality.

## 📄 Version Management

The project uses **PNPM Catalog** for unified version management:
- All external dependency versions are centrally managed in pnpm-workspace.yaml
- Workspace packages reference each other via `workspace:^`
- Packages are published to npm under `@truenine/` scope with LGPL-2.1-or-later license

## 🤝 Contributing Guidelines

1. Ensure all commits follow established code standards
2. Include appropriate unit tests
3. Run `pnpm ci:build` to ensure all checks pass
4. Follow the project's TypeScript and ESLint configurations

## 📜 License

This project is licensed under [LGPL-2.1-or-later](./LICENSE).

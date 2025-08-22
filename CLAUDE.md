# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Environment Requirements

- **Node.js**: 24.5.0+
- **PNPM**: 10.15.0+
- **Turbo**: 2.5.6+
- **TypeScript**: 5.9.2+

## Common Development Commands

### Root Level Commands
```bash
# Build entire project
pnpm build

# Run tests for all packages
pnpm test

# Run lint checks for all packages
pnpm lint

# Run type checking for all packages
pnpm type-check

# Start development servers (packages with playground)
pnpm dev

# Install dependencies and build all packages
pnpm install
```

### Individual Package Operations
```bash
# Run tests for specific package
turbo run test --filter=package-name

# Build specific package
turbo run build --filter=package-name

# Run compilation step for specific package (TSDown packages)
turbo run build-c --filter=package-name

# Run post-processing step for specific package (Gulp CSS processing)
turbo run build-g --filter=package-name

# Run specific test file in package directory
cd packages/package-name && npx vitest run path/to/test.spec.ts

# Run specific test file in watch mode
cd packages/package-name && npx vitest watch path/to/test.spec.ts

# Start development server for specific package
turbo run dev --filter=@truenine/ui
turbo run dev --filter=@truenine/design
```

### Turbo Task Dependencies
- **build**: depends on type-check, lint, ^build
- **build-c**: depends on ^build (compilation step for TSDown packages)
- **build-g**: depends on build-c (post-processing step for UI packages)
- **test**: depends on ^build, type-check, lint  
- **lint**: depends on ^build
- **type-check**: depends on ^build

## Project Architecture

### Overall Structure
This is a **monorepo** project using PNPM Workspace + Turbo build system. All packages are ESM modules written in TypeScript.

### Core Package Structure
- **configs/**: Build configuration packages (eslint9, tsconfig, uno, vite)
- **types/**: Global type definitions and TypeScript utility types
- **shared/**: Common utility functions and constants
- **vue/**: Vue3 base tools and installers
- **external/**: Third-party library wrappers (dayjs, lodash-es, vue-router, etc.)

### Business Package Structure
- **ui/**: Vue3 component library (based on Element Plus, Vuetify, Varlet)
- **design/**: Designer system components
- **req/**: Network request utilities (based on ky)
- **psdk/**: Platform SDKs (tmap for Tencent Maps, wxpa for WeChat Public Account)
- **ext/**: Browser extensions (chrome)

### Build Tools
- **Turbo**: Task orchestration and caching
- **TSDown**: TypeScript compilation (configs, shared, types, req, vue, external, psdk, ext)
- **Vite**: Build tool (ui, design - packages with playground)
- **Vitest**: Testing framework (unified configuration for all packages)

### Dependency Management
Uses **PNPM Catalog** for unified version management. Workspace packages reference each other via `workspace:^`.

### Package Publishing
Packages are published to npm under `@truenine/` scope with LGPL-2.1-or-later license.

## Development Guidelines

### Testing Standards
- Uses Vitest + jsdom environment
- Component testing with @vue/test-utils
- Test files in `__tests__` directories or with `.spec.ts` suffix

### Build Artifacts
- **dist/**: Build output directory
- **TSDown packages**: Generate ESM + CJS dual format with sourcemap and dts
  - configs/, shared/, types/, req/, vue/, external/, psdk/, ext/
- **Vite packages**: Generate ESM format with CSS extraction and Gulp post-processing
  - ui/, design/ (includes playground)

### Test Execution
- **Root level**: Uses vitest.workspace.ts to manage all packages
- **Individual packages**: Each package has independent vitest.config.ts
- **Component testing**: Uses jsdom environment + @vue/test-utils

### Playground
ui and design packages contain playground directories for development debugging, using Vue Router for page management. Start with `turbo run dev --filter=@truenine/ui`.

### Build Process
- **build-c**: Compilation step using TSDown or Vite
- **build-g**: Post-processing step using Gulp for CSS optimization (ui/design only)
- **build**: Complete build including type-check, lint, and dependencies
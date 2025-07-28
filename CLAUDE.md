# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 开发环境要求

- **Node.js**: 24.4.1+
- **PNPM**: 10.13.1+
- **Turbo**: 2.5.5+
- **TypeScript**: 5.8.3+

## 常用开发命令

### 根目录命令
```bash
# 构建整个项目
pnpm build

# 运行所有包的测试
pnpm test

# 运行所有包的 lint 检查
pnpm lint

# 运行所有包的类型检查
pnpm type-check

# 启动开发服务器（有 playground 的包）
pnpm dev

# 安装依赖并构建所有包
pnpm install
```

### 单个测试文件
```bash
# 在包目录中运行特定测试文件
npx vitest run path/to/test.spec.ts

# 或在根目录使用 turbo
turbo run test --filter=package-name
```

## 项目架构

### 整体结构
这是一个 **monorepo** 项目，使用 PNPM Workspace + Turbo 构建系统。所有包都是 ESM 模块，使用 TypeScript 编写。

### 核心包结构
- **configs/**: 构建配置包（eslint9, tsconfig, uno, vite）
- **types/**: 全局类型定义和 TypeScript 工具类型
- **shared/**: 通用工具函数和常量
- **vue/**: Vue3 基础工具和安装器
- **external/**: 第三方库封装（dayjs, lodash-es, vue-router 等）

### 业务包结构
- **ui/**: Vue3 组件库（基于 Element Plus, Vuetify, Varlet）
- **design/**: 设计器系统组件
- **req/**: 网络请求工具（基于 ky）
- **psdk/**: 平台 SDK（tmap 腾讯地图, wxpa 微信公众号）
- **ext/**: 浏览器扩展（chrome）

### 构建工具
- **Turbo**: 任务编排和缓存
- **TSDown**: TypeScript 编译（configs, shared, types, req, vue, external, psdk, ext）
- **Vite**: 构建工具（ui, design - 有 playground 的包）
- **Vitest**: 测试框架（所有包统一配置）

### 依赖管理
使用 **PNPM Catalog** 统一版本管理，workspace 包通过 `workspace:^` 引用。

### 包发布
packages 通过 `@truenine/` 作用域发布到 npm，采用 LGPL-2.1-or-later 协议。

## 开发注意事项

### 测试规范
- 使用 Vitest + jsdom 环境
- 组件测试使用 @vue/test-utils
- 测试文件放在 `__tests__` 目录或 `.spec.ts` 后缀

### 构建产物
- **dist/**: 构建输出目录
- **TSDown**: 生成 cjs + esm 双格式，包含 sourcemap 和 dts
- **Vite**: 生成 esm 格式，支持 CSS 提取

### Playground
ui 和 design 包含 playground 目录用于开发调试，使用 Vue Router 管理页面。

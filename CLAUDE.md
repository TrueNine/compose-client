# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于 PNPM Workspace 的 TypeScript/Vue3 monorepo 项目，由百研科技开发的前端工具库集合，包含多个子包：

- **configs/**: ESLint、TypeScript、UnoCSS、Vite 配置包
- **shared/**: 共享工具库（字符串、数组、异步等工具函数）
- **types/**: TypeScript 类型定义
- **ui/**: Vue3 组件库（支持 Element Plus、Vuetify、Varlet）
- **vue/**: Vue3 安装和基础工具
- **external/**: 外部库封装（dayjs、lodash-es、vue-router等）
- **req/**: HTTP 请求工具（基于 ky）
- **psdk/**: 平台 SDK（腾讯地图、微信公众号）
- **ext/**: 浏览器扩展相关
- **design/**: 设计系统组件

## 架构特点

### Monorepo 管理
- 使用 PNPM workspace 管理依赖
- Turbo 用于构建缓存和并行执行
- 统一的 catalog 依赖版本管理

### 包依赖关系
- `types` 包被其他所有包依赖，提供基础类型定义
- `shared` 包提供通用工具函数，被 UI 包依赖
- `vue` 包提供 Vue3 基础安装逻辑
- `configs/*` 包提供构建和代码质量配置

### 构建系统
- 使用 Vite 构建所有包
- 支持 ESM 和 CJS 双输出格式
- 统一的 TypeScript 配置继承
- UnoCSS 作为 CSS 框架

### UI 组件库架构
- 支持多个 UI 框架：Element Plus、Vuetify、Varlet
- 使用 Vee-validate + Yup/Zod 进行表单验证
- 组件采用 Vue 3 Composition API
- 支持 TypeScript 严格模式

### 测试策略
- 使用 Vitest 进行单元测试
- JSDOM 环境用于 Vue 组件测试
- 每个包都有独立的测试配置

## 开发约定

### 包结构
每个子包都遵循相同的结构：
```
package/
├── src/                # 源代码
├── dist/              # 构建输出
├── __tests__/         # 测试文件
├── package.json       # 包配置
├── vite.config.ts     # Vite 配置
├── vitest.config.ts   # 测试配置
└── tsconfig.json      # TS 配置
```

### 版本管理
- 根包版本：1.0.9
- 子包使用 workspace:^ 引用内部依赖
- catalog 统一管理外部依赖版本

### 构建流程
每个包的标准构建流程：`type-check → lint → test → build-c`

## 技术栈
- **语言**: TypeScript 5.8+
- **框架**: Vue 3.5+
- **构建**: Vite 6+ + Rollup
- **测试**: Vitest 3+
- **样式**: UnoCSS + SCSS
- **代码质量**: ESLint 9 + @antfu/eslint-config
- **包管理**: PNPM 10.13.1+
- **Node**: 24.0.1+

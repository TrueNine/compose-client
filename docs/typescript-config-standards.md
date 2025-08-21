# TypeScript 配置文件命名规范

## 概述

本文档定义了项目中 TypeScript 配置文件的统一命名规范和使用指南。通过遵循这些规范，可以提高项目的一致性和可维护性。

## 核心原则

1. **语义化命名** - 配置文件名应清楚表达其用途和适用场景
2. **一致性** - 所有模块使用相同的命名规范
3. **可扩展性** - 命名规范应支持未来的扩展需求
4. **工具兼容性** - 确保与现有工具链的良好兼容

## 标准配置文件类型

### 主配置文件

#### `tsconfig.json`
- **用途**: 项目的主配置文件，包含项目引用和基础配置
- **适用模块**: 所有模块
- **特点**:
  - 使用 `references` 字段引用其他配置文件
  - 不包含具体的编译选项
  - 作为 IDE 和工具的入口配置

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.lib.json" },
    { "path": "./tsconfig.test.json" },
    { "path": "./tsconfig.tools.json" }
  ]
}
```

### 构建配置文件

#### `tsconfig.lib.json`
- **用途**: 库模块的构建配置
- **适用模块**: shared, types, vue, req, external, configs/*
- **特点**:
  - 用于生成库文件和类型声明
  - 排除测试文件和开发文件
  - 优化输出结构

```json
{
  "extends": ["@truenine/tsconfig/tsconfig.json"],
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.lib.tsbuildinfo",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [
    "src/**/*.ts",
    "src/**/*.d.ts"
  ]
}
```

#### `tsconfig.app.json`
- **用途**: 应用程序的构建配置
- **适用模块**: ui, design
- **特点**:
  - 用于构建可运行的应用程序
  - 包含应用程序特定的配置
  - 支持 Vue 单文件组件

```json
{
  "extends": ["@truenine/tsconfig/tsconfig.json"],
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "jsx": "preserve",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": [
    "env.d.ts",
    "src/**/*.ts",
    "src/**/*.d.ts"
  ]
}
```

### 环境特定配置

#### `tsconfig.node.json`
- **用途**: Node.js 环境的配置
- **适用模块**: types, configs/*
- **特点**:
  - 针对 Node.js 运行时优化
  - 包含 Node.js 类型定义
  - 用于构建工具和脚本

```json
{
  "extends": ["@truenine/tsconfig/tsconfig.json"],
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "types": ["node"]
  },
  "include": ["**/*.ts", "**/*.js"]
}
```

#### `tsconfig.vue.json`
- **用途**: Vue 组件的配置
- **适用模块**: ui, design
- **特点**:
  - 支持 Vue 单文件组件
  - 包含 Vue 相关类型定义
  - 用于 IDE 支持和类型检查

```json
{
  "extends": ["@truenine/tsconfig/tsconfig.json"],
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.vue.tsbuildinfo",
    "jsx": "preserve",
    "jsxImportSource": "vue",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*.vue", "src/**/*.ts", "src/**/*.d.ts"]
}
```

### 工具配置文件

#### `tsconfig.test.json`
- **用途**: 测试文件的配置
- **适用模块**: 所有包含测试的模块
- **特点**:
  - 包含测试相关的类型定义
  - 支持测试框架特定的配置
  - 包含测试文件和辅助文件

```json
{
  "extends": "./tsconfig.lib.json",
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.test.tsbuildinfo",
    "lib": [],
    "types": ["node"]
  },
  "include": ["src/**/__tests__/**/*.{spec,test}.{ts,tsx}", "env.d.ts"]
}
```

#### `tsconfig.tools.json`
- **用途**: 构建工具和配置文件的配置
- **适用模块**: 所有模块
- **特点**:
  - 用于编译构建脚本和配置文件
  - 包含 Node.js 和构建工具的类型定义
  - 支持 ES 模块和 CommonJS

```json
{
  "extends": ["@truenine/tsconfig/tsconfig.json"],
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.tools.tsbuildinfo",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "types": ["node"]
  },
  "include": [
    "vite.config.ts",
    "vitest.config.ts",
    "eslint.config.mjs",
    "tsdown.config.ts",
    "uno.config.ts"
  ]
}
```

#### `tsconfig.dev.json`
- **用途**: 开发环境的配置
- **适用模块**: ui, design
- **特点**:
  - 用于开发服务器和热重载
  - 包含开发时的特殊配置
  - 支持 playground 和示例代码

```json
{
  "extends": "./tsconfig.app.json",
  "compilerOptions": {
    "noEmit": true
  },
  "include": [
    "playground/**/*",
    "src/**/*",
    "index.html"
  ]
}
```

## 模块类型配置模板

### 库模块模板 (shared, types, vue, req, external)

```json
// tsconfig.json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.lib.json" },
    { "path": "./tsconfig.test.json" },
    { "path": "./tsconfig.tools.json" }
  ]
}
```

### 应用模块模板 (ui, design)

```json
// tsconfig.json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.test.json" },
    { "path": "./tsconfig.tools.json" },
    { "path": "./tsconfig.vue.json" },
    { "path": "./tsconfig.dev.json" }
  ]
}
```

### Node 模块模板 (configs/*)

```json
// tsconfig.json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.node.json" },
    { "path": "./tsconfig.test.json" }
  ]
}
```

## 工具配置集成

### Vite 配置

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dts({
      tsconfigPath: './tsconfig.lib.json', // 库模块
      // 或
      tsconfigPath: './tsconfig.vue.json', // Vue 应用模块
    })
  ]
})
```

### ESLint 配置

```javascript
// eslint.config.mjs
import tseslint from 'typescript-eslint'

export default tseslint.config({
  languageOptions: {
    parserOptions: {
      project: './tsconfig.json', // 主配置文件
      tsconfigRootDir: import.meta.dirname,
    }
  }
})
```

### tsdown 配置

```typescript
// tsdown.config.ts
import { defineConfig } from 'tsdown'

export default defineConfig({
  tsconfig: './tsconfig.lib.json', // 库模块
  // 或
  tsconfig: './tsconfig.node.json', // Node 模块
})
```

## 新模块创建指南

### 1. 确定模块类型

- **库模块**: 提供可重用的功能，发布到 npm
- **应用模块**: 可运行的前端应用程序
- **Node 模块**: Node.js 环境的工具或配置
- **配置模块**: 共享的配置和工具

### 2. 创建配置文件

根据模块类型选择相应的模板：

#### 库模块步骤
1. 复制库模块模板到新模块目录
2. 创建 `tsconfig.lib.json`、`tsconfig.test.json`、`tsconfig.tools.json`
3. 根据具体需求调整配置选项
4. 更新 `vite.config.ts` 中的 `tsconfigPath`

#### 应用模块步骤
1. 复制应用模块模板到新模块目录
2. 创建所有必需的配置文件
3. 配置 Vue 支持（如果需要）
4. 设置开发服务器配置

#### Node 模块步骤
1. 复制 Node 模块模板到新模块目录
2. 创建 `tsconfig.node.json` 和 `tsconfig.test.json`
3. 配置 Node.js 特定的选项

### 3. 验证配置

```bash
# 类型检查
pnpm type-check

# 构建验证
pnpm build

# 测试验证
pnpm test

# 代码质量检查
pnpm lint
```

## 迁移指南

### 从旧命名规范迁移

| 旧文件名 | 新文件名 | 迁移说明 |
|---------|---------|----------|
| `tsconfig.build.json` | `tsconfig.lib.json` (库) / `tsconfig.app.json` (应用) | 根据模块类型选择 |
| `tsconfig.vitest.json` | `tsconfig.test.json` | 直接重命名 |
| `tsconfig.config.json` | `tsconfig.tools.json` | 直接重命名 |
| `tsconfig.playground.json` | `tsconfig.dev.json` | 直接重命名 |

### 迁移步骤

1. **备份现有配置** - 创建配置文件的备份
2. **重命名文件** - 按照新规范重命名配置文件
3. **更新引用** - 修改 `tsconfig.json` 中的项目引用
4. **更新工具配置** - 修改 Vite、ESLint、tsdown 等工具的配置
5. **验证功能** - 确保所有功能正常工作

## 最佳实践

### 1. 配置继承

- 使用 `extends` 字段继承基础配置
- 避免重复配置选项
- 保持配置的层次结构清晰

### 2. 路径配置

- 使用相对路径引用配置文件
- 保持路径的一致性
- 避免使用绝对路径

### 3. 包含和排除规则

- 明确指定包含的文件模式
- 合理使用排除规则避免不必要的文件
- 考虑性能影响

### 4. 工具集成

- 确保所有工具使用正确的配置文件
- 定期验证工具配置的有效性
- 保持工具版本的兼容性

## 故障排除

### 常见问题

1. **类型检查失败**
   - 检查配置文件路径是否正确
   - 验证项目引用是否完整
   - 确认包含/排除规则是否合理

2. **构建失败**
   - 检查输出目录配置
   - 验证源文件路径设置
   - 确认依赖关系正确

3. **IDE 支持问题**
   - 重启 IDE 重新加载配置
   - 检查 IDE 的 TypeScript 版本
   - 验证工作区配置

### 调试技巧

```bash
# 检查配置文件语法
npx tsc --showConfig --project tsconfig.json

# 验证项目引用
npx tsc --build --dry --verbose

# 检查包含的文件
npx tsc --listFiles --project tsconfig.lib.json
```

## 版本兼容性

- **TypeScript**: 5.0+
- **Node.js**: 18+
- **Vite**: 5.0+
- **ESLint**: 9.0+

## 更新日志

- **v1.0.0** - 初始版本，建立基础命名规范
- **v1.1.0** - 添加 Vue 应用模块支持
- **v1.2.0** - 完善工具配置集成指南

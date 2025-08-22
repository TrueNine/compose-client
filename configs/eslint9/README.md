# ESLint 9 配置包

这是一个针对 Compose Client 项目优化的 ESLint 9 配置包，提供了缓存优化、性能调优和规则优化功能。

## 功能特性

### 🚀 性能优化
- **智能缓存**: 支持 metadata 和 content 两种缓存策略
- **并行处理**: 自动利用多核 CPU 进行并行检查
- **规则优化**: 可选择跳过性能影响大的规则
- **渐进式检查**: 优先检查关键文件

### 📋 预设配置
- **performance**: 性能优先，适用于大型项目或 CI 环境
- **quality**: 质量优先，适用于小型项目或开发环境
- **balanced**: 平衡配置，默认推荐
- **ci**: CI 环境专用配置
- **dev**: 开发环境友好配置
- **library**: 库项目严格配置

### 🎯 智能忽略
- 自动忽略构建产物、缓存目录、压缩文件等
- 可配置的关键文件优先检查
- 支持自定义忽略模式

## 使用方法

### 基础用法

```javascript
// eslint.config.mjs
import eslint9 from '@truenine/eslint9-config'

export default eslint9({
  type: 'lib',
  typescript: {
    strictTypescriptEslint: true,
    tsconfigPath: './tsconfig.json',
  },
})
```

### 使用预设配置

```javascript
// eslint.config.mjs
import eslint9, { applyPreset } from '@truenine/eslint9-config'

export default eslint9({
  type: 'lib',
  typescript: {
    strictTypescriptEslint: true,
    tsconfigPath: './tsconfig.json',
  },
  // 使用平衡预设
  ...applyPreset('balanced'),
})
```

### 自定义配置

```javascript
// eslint.config.mjs
import eslint9, { applyPreset } from '@truenine/eslint9-config'

export default eslint9({
  type: 'lib',
  vue: true,
  typescript: {
    strictTypescriptEslint: true,
    tsconfigPath: './tsconfig.json',
  },
  // 自定义缓存配置
  cache: {
    location: '.eslintcache',
    strategy: 'metadata',
  },
  // 性能优化配置
  performance: {
    parallel: true,
    skipExpensiveRules: false,
  },
  // 规则优化配置
  ruleOptimization: {
    progressive: true,
    criticalFirst: true,
    customOverrides: {
      'ts/no-explicit-any': 'warn',
      'complexity': ['warn', { max: 15 }],
    },
  },
})
```

## 配置选项

### 缓存配置 (cache)

```typescript
cache?: boolean | {
  /** 缓存位置，默认为 .eslintcache */
  location?: string
  /** 缓存策略，默认为 metadata */
  strategy?: 'metadata' | 'content'
}
```

### 性能配置 (performance)

```typescript
performance?: {
  /** 启用并行处理，默认为 true */
  parallel?: boolean
  /** 最大并行数，默认为 CPU 核心数 */
  maxParallel?: number
  /** 忽略性能影响大的规则 */
  skipExpensiveRules?: boolean
}
```

### 规则优化配置 (ruleOptimization)

```typescript
ruleOptimization?: {
  /** 是否启用渐进式检查 */
  progressive?: boolean
  /** 关键文件优先检查 */
  criticalFirst?: boolean
  /** 跳过性能影响大的规则 */
  skipExpensive?: boolean
  /** 自定义规则覆盖 */
  customOverrides?: Record<string, string>
}
```

## 预设配置详情

### Performance 预设
适用于大型项目或 CI 环境，优先考虑检查速度：
- 启用 metadata 缓存策略
- 跳过性能影响大的规则
- 启用渐进式检查

### Quality 预设
适用于小型项目或开发环境，优先考虑代码质量：
- 启用 content 缓存策略
- 保留所有质量检查规则
- 严格的错误级别

### Balanced 预设
默认推荐配置，平衡性能和质量：
- metadata 缓存策略
- 适中的规则严格程度
- 启用关键文件优先检查

### CI 预设
专为持续集成环境优化：
- 跳过耗时规则
- 只保留关键错误检查
- 忽略测试文件

### Dev 预设
开发环境友好配置：
- 更宽松的规则设置
- 允许 console 和 debugger
- 警告级别而非错误级别

### Library 预设
适用于开源库或组件库：
- 最严格的规则设置
- 要求完整的类型注解
- 强制文档注释

## 性能优化建议

### 1. 启用缓存
```bash
# package.json
{
  "scripts": {
    "lint": "eslint --fix --cache --cache-location .eslintcache"
  }
}
```

### 2. 使用合适的预设
- 开发环境使用 `dev` 预设
- CI 环境使用 `ci` 预设
- 生产库使用 `library` 预设

### 3. 配置忽略模式
确保 `.eslintignore` 或配置中包含不需要检查的文件：
```
dist/
build/
coverage/
.turbo/
node_modules/
*.min.js
```

### 4. 渐进式检查
对于大型项目，启用渐进式检查：
```javascript
ruleOptimization: {
  progressive: true,
  criticalFirst: true,
}
```

## 故障排除

### 缓存问题
如果遇到缓存相关问题，可以清理缓存：
```bash
rm -rf .eslintcache
```

### 性能问题
如果检查速度过慢，可以：
1. 启用 `skipExpensiveRules` 选项
2. 使用 `performance` 预设
3. 增加忽略模式

### 规则冲突
如果遇到规则冲突，可以通过 `customOverrides` 覆盖：
```javascript
ruleOptimization: {
  customOverrides: {
    'conflicting-rule': 'off',
  },
}
```

## 更新日志

### v1.0.0
- 初始版本
- 支持缓存优化
- 提供预设配置
- 集成规则优化器

# Compose-Client


## Build Environment

- Node.js 24.0.1+
- PNPM: 10.13.1+
- Turbo: 2.5.5+
- Typescript: 5.8.3+

## 项目目录结构

```
compose-client/
├── configs/                      # 配置 - 构建和开发工具配置
│   ├── eslint9/                  # ESLint 9 配置包
│   ├── tsconfig/                 # TypeScript 配置包
│   ├── uno/                      # UnoCSS 配置包
│   └── vite/                     # Vite 构建配置包
├── types/                        # 基础 - 全局类型定义
├── shared/                       # 工具 - 共享工具函数
├── vue/                          # 工具 - Vue3 基础工具
├── external/                     # 工具 - 外部库封装
├── ui/                           # Vue3 组件库
├── design/                       # 设计器系统组件
├── req/                          # 网络请求请求工具
├── psdk/                         # 平台 SDK
│   ├── tmap/                     # 腾讯地图 SDK
│   └── wxpa/                     # 微信公众号 SDK
├── ext/                          # 浏览器扩展
│   └── chrome/                   # Chrome 扩展
├── package.json
├── pnpm-workspace.yaml
├── turbo.json
└── vitest.workspace.ts
```

请注意，此项目采用 [LGPL-2.1-or-later](/LICENSE) 协议。

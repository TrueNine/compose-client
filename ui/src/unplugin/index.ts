export type ResolverType = 'component' | 'directive'

function camelTo(str: string, sep = '-'): string {
  // Example: YButton -> yButton, YTestComponent -> yTestComponent
  const firstCharLower = str.charAt(0).toLowerCase() + str.slice(1)
  // Example: yButton -> y-button, yTestComponent -> y-test-component
  return firstCharLower.replace(/([a-z0-9])([A-Z])/g, `$1${sep}$2`).toLowerCase()
}

function resolveComponent(name: string): { name: string, from: string, satisfies: string[] } | undefined {
  if (/^Y[A-Z]/.exec(name)) {
    // 组件名如 YBtn -> btn, YConfigProvider -> config-provider
    const kebabName = camelTo(name.slice(1))
    return {
      name: 'default',
      from: `@compose/ui/components/${kebabName}/index`,
      satisfies: [`@compose/ui/dist/components/${kebabName}/index.css`],
    }
  }
}

/**
 * 生成 Meta UI Web 组件自动解析器配置。
 *
 * 用于按需引入 @compose/ui 的组件及其样式，通常配合自动按需引入插件（如 unplugin-vue-components）使用。
 *
 * 返回值为解析器对象数组，每个对象包含：
 * - type: 解析类型（此处为 'component'）
 * - resolve: 组件名称解析函数，接收组件名，返回包含组件名、来源路径、样式依赖的对象，未命中时返回 undefined
 *
 * 示例用法：
 * ```ts
 * const resolvers = MetaUiWebResolver();
 * // 用于自动导入 Y 开头的组件及其样式
 * ```
 */
export function MetaUiWebResolver(): { type: string, resolve: (name: string) => { name: string, from: string, satisfies: string[] } | undefined }[] {
  return [
    {
      type: 'component',
      resolve: resolveComponent,
    },
  ]
}

const _vLabsComponentNames = [
  'VCalendar',
  'VNumberInput',
  'VPicker',
  'VDateInput',
  'VPullToRefresh',
  'VSnackbarQueue',
  'VStepperVertical',
  'VTimePicker',
  'VTreeview',
]
export function Vuetify3LabsLabResolver(useLabs = true): { type: string, resolve: (name: string) => { name: string, from: string } | undefined } {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (/^V[A-Z]/.exec(name)) {
        return { name, from: useLabs && _vLabsComponentNames.includes(name) ? 'vuetify/labs/components' : 'vuetify/components' }
      }
    },
  }
}

import type {dynamic} from '@truenine/types'
import type {App} from 'vue'

export interface VueComponentInstanceMapping {
  name?: string
  __name?: string
  [key: string]: unknown
}

type SFCWithInstall<T = dynamic> = T & VueComponentInstanceMapping & {
  install: (app: App) => void
}

/**
 * ## 准备一个安装的组件
 *
 * @param component 组件实例
 * @param otherComponent 其他一同注册的组件实例
 * @returns 封装后的组件
 */
export function componentInstallToPlugin<T extends VueComponentInstanceMapping>(
  component: T,
  otherComponent?: Record<string, unknown>,
): T {
  let primaryComponent = component as unknown as SFCWithInstall<T>
  const otherSecondaryComponentInstallers: Record<string, SFCWithInstall<T>> = {}

  if (!otherComponent) return primaryComponent

  for (const [key, comp] of Object.entries(otherComponent)) otherSecondaryComponentInstallers[key] = comp as SFCWithInstall<T>

  if (primaryComponent.name == null) primaryComponent = {...primaryComponent, name: primaryComponent.__name}

  primaryComponent.install = (app: App) => {
    const allInstallComponents = [primaryComponent, ...Object.values(otherSecondaryComponentInstallers)]
    for (const toInstallComponent of allInstallComponents) {
      const {name = void 0, __name = void 0} = toInstallComponent
      const resolvedName = name ?? __name
      if (typeof resolvedName !== 'string' || !resolvedName) throw new Error('组件缺少有效的 name 或 __name 属性，无法注册到 app.component')

      app.component(resolvedName, toInstallComponent)
    }
  }

  if (Object.keys(otherSecondaryComponentInstallers).length === 0) return primaryComponent

  const extendedComponent = primaryComponent as unknown as Record<string, unknown>
  Object.entries(otherSecondaryComponentInstallers).forEach(([key, comp]) => extendedComponent[key] = comp)

  return primaryComponent as T
}

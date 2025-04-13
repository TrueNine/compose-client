import type { dynamic } from '@compose/api-types'
import type { App } from 'vue'

interface VueComponentInstanceMapping {
  name?: string
  __name?: string
  [key: string]: unknown
}

type SFCWithInstall<T = dynamic> = T & VueComponentInstanceMapping & {
  install: (app: App) => void
}

const undefinedName = 'NameUndefined'

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

  if (otherComponent) {
    for (const [key, comp] of Object.entries(otherComponent)) {
      otherSecondaryComponentInstallers[key] = comp as SFCWithInstall<T>
    }
  }

  if (primaryComponent.name == null) {
    primaryComponent = { ...primaryComponent, name: primaryComponent.__name }
  }

  primaryComponent.install = (app: App) => {
    const allInstallComponents = [primaryComponent, ...Object.values(otherSecondaryComponentInstallers)]
    for (const toInstallComponent of allInstallComponents) {
      const { name = void 0, __name = void 0 } = toInstallComponent
      app.component(name ?? __name ?? undefinedName, toInstallComponent)
    }
  }

  if (Object.keys(otherSecondaryComponentInstallers).length > 0) {
    const extendedComponent = primaryComponent as unknown as Record<string, unknown>
    Object.entries(otherSecondaryComponentInstallers).forEach(([key, comp]) => {
      extendedComponent[key] = comp
    })
  }

  return primaryComponent as T
}

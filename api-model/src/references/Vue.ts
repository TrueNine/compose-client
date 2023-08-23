import {type Plugin} from 'vue'

export {}

interface _InstallInvoke {
  name?: string
  __name?: string
}

/**
 * ## 针对 vue 封装的一些工具函数
 */
export class Vue {
  /**
   * ## 准备一个安装的组件
   * @param component 组件
   * @returns 封装后的组件
   */
  static componentInstallToPlugin<T>(component: T): T & Plugin & _InstallInvoke {
    const _p = component as T & Plugin
    _p.install = app => {
      const {name, __name = undefined} = _p as unknown as T & Plugin & _InstallInvoke
      if (name) app.component(name, _p)
      else app.component(__name ?? 'NameUndefined', _p)
    }
    return _p
  }
}

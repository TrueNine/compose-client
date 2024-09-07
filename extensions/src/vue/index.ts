import type {clip, dynamic, Maybe} from '@compose/api-types'
import {maybeArray} from '@compose/api-model'
import type {
  Plugin,
  RendererElement,
  RendererNode,
  VNode,
  EmitsOptions,
  SlotsType,
  ExtractDefaultPropTypes,
  ObjectEmitsOptions,
  DefineComponent,
  ComputedOptions,
  MethodOptions,
  ComponentOptionsMixin,
  PublicProps,
  ComponentPropsOptions,
  ExtractPropTypes
} from 'vue'

type EmitsToProps<T extends EmitsOptions> = T extends string[]
  ? {
      [K in `on${Capitalize<T[number]>}`]?: (...args: any[]) => any
    }
  : T extends ObjectEmitsOptions
    ? {
        [K in `on${Capitalize<string & keyof T>}`]?: K extends `on${infer C}`
          ? (...args: T[Uncapitalize<C>] extends (...args: infer P) => any ? P : T[Uncapitalize<C>] extends null ? any[] : never) => any
          : never
      }
    : object
type ResolveProps<PropsOrPropOptions, E extends EmitsOptions> = Readonly<
  PropsOrPropOptions extends ComponentPropsOptions ? ExtractPropTypes<PropsOrPropOptions> : PropsOrPropOptions
> &
  (object extends E ? object : EmitsToProps<E>)

export interface VueComponentInstanceMapping {
  name?: string
  __name?: string
}

export type SFCWithInstall<T = dynamic> = T & Plugin & VueComponentInstanceMapping & {install: (app: dynamic) => void}

type SlotNode = VNode<RendererNode, RendererElement, Record<string, dynamic>> & {actualName?: string}
type NotChildrenSlotNode = clip<SlotNode, 'children'>

export interface GenericProps<
  Props extends object = object,
  Emits extends EmitsOptions = Record<string, null>,
  Slots extends SlotsType = SlotsType,
  Mixin extends ComponentOptionsMixin = ComponentOptionsMixin
> {
  props?: Props
  emits?: Emits
  slots?: Slots
  mixin?: Mixin
}

export type DefineComponentPart<
  Props,
  Emits extends EmitsOptions,
  Slots extends SlotsType = SlotsType,
  Mixin extends ComponentOptionsMixin = ComponentOptionsMixin,
  Expose = {},
  _D = {},
  _ComputedOptions extends ComputedOptions = ComputedOptions,
  _MethodOptions extends MethodOptions = MethodOptions,
  _ExtendsComponentOptionsMixin extends ComponentOptionsMixin = ComponentOptionsMixin,
  _EE extends string = string,
  _PP = PublicProps,
  _Props = ResolveProps<Props, Emits>,
  _Defaults = ExtractDefaultPropTypes<Props>
> = DefineComponent<Props, Expose, _D, _ComputedOptions, _MethodOptions, Mixin, _ExtendsComponentOptionsMixin, Emits, _EE, _PP, _Props, _Defaults, Slots>

/**
 * ## 针对 vue 封装的一些工具函数
 */
export class Vue {
  static UNDEFINED_NAME = 'NameUndefined'

  /**
   * ## 准备一个安装的组件
   *
   * @param component 组件实例
   * @param otherComponent 其他一同注册的组件实例
   * @returns 封装后的组件
   */
  static componentInstallToPlugin<T, E = dynamic>(component: T, otherComponent?: Record<string, E>): T {
    let _p = component as unknown as SFCWithInstall<T>
    const _r = otherComponent as unknown as Record<string, SFCWithInstall<T>>
    if (!_p.name) _p = {..._p, name: _p.__name}
    _p.install = app => {
      for (const c of [_p, ...Object.values(_r != null ? _r : {})]) {
        const {name = undefined, __name = undefined} = _p
        app.component(__name || name || Vue.UNDEFINED_NAME, _p)
        app.component(_p.name || Vue.UNDEFINED_NAME, c)
      }
    }
    if (_r) {
      for (const [key, comp] of Object.entries(_r)) {
        ;(_p as dynamic)[key] = comp
      }
    }
    return _p as unknown as T
  }

  static findSlotNodesBy(compareFn: (node: NotChildrenSlotNode) => boolean = () => true, arg?: Maybe<SlotNode>): SlotNode[] {
    const res: SlotNode[] = []
    const _m = maybeArray(arg).filter(Boolean)
    if (!_m) return []
    _m.forEach(ele => res.push(...this._findSlotNodesBy(ele!, compareFn)))
    return res
  }

  static findSlotNodesByName(componentName: string = '', arg?: Maybe<SlotNode>): SlotNode[] {
    const res: SlotNode[] = []
    const m = maybeArray(arg).filter(Boolean)
    if (!m) return []
    m.forEach(ele => res.push(...this._findSlotNodesBy(ele!, v => v.actualName === componentName)))
    return res
  }

  private static _findSlotNodesBy(node: Maybe<SlotNode>, compareFn: (node: NotChildrenSlotNode) => boolean = () => true, result: SlotNode[] = []): SlotNode[] {
    const nodes = maybeArray(node)
    nodes.forEach(n => {
      const r = n.type as Record<string, string>
      n.actualName = r?.name || r?.__name
      if (compareFn(n)) result.push(n)
      if (n.children && typeof n.children !== 'string') this._findSlotNodesBy(n.children as unknown as SlotNode, compareFn, result)
    })
    return result
  }
}

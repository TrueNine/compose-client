import type {clip, dynamic, Maybe} from '@compose/api-types'
import {maybeArray} from '@compose/api-model'
import type {
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
  ExtractPropTypes,
  App
} from 'vue'

type EmitsToProps<T extends EmitsOptions> = T extends string[]
  ? Partial<Record<`on${Capitalize<T[number]>}`, (...args: dynamic[]) => dynamic>>
  : T extends ObjectEmitsOptions
    ? {
        [K in `on${Capitalize<string & keyof T>}`]?: K extends `on${infer C}`
          ? (...args: T[Uncapitalize<C>] extends (...args: infer P) => dynamic ? P : T[Uncapitalize<C>] extends null ? dynamic[] : never) => dynamic
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

export type SFCWithInstall<T = dynamic> = T & VueComponentInstanceMapping & {install: (app: dynamic) => void}

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
  Expose = object,
  _D = object,
  _ComputedOptions extends ComputedOptions = ComputedOptions,
  _MethodOptions extends MethodOptions = MethodOptions,
  _ExtendsComponentOptionsMixin extends ComponentOptionsMixin = ComponentOptionsMixin,
  _EE extends string = string,
  _PP = PublicProps,
  _Props = ResolveProps<Props, Emits>,
  _Defaults = ExtractDefaultPropTypes<Props>
> = DefineComponent<Props, Expose, _D, _ComputedOptions, _MethodOptions, Mixin, _ExtendsComponentOptionsMixin, Emits, _EE, _PP, _Props, _Defaults, Slots>

const undefinedName = 'NameUndefined'

/**
 * ## 准备一个安装的组件
 *
 * @param component 组件实例
 * @param otherComponent 其他一同注册的组件实例
 * @returns 封装后的组件
 */
export function componentInstallToPlugin<T, E = dynamic>(component: T, otherComponent?: Record<string, E>): T {
  let primaryComponent = component as unknown as SFCWithInstall<T>
  const otherSecondaryComponentInstallers = otherComponent as unknown as Record<string, SFCWithInstall<T>> | undefined
  if (!primaryComponent.name) primaryComponent = {...primaryComponent, name: primaryComponent.__name}
  primaryComponent.install = (app: App) => {
    const allInstallComponents = [primaryComponent, ...Object.values(otherSecondaryComponentInstallers ?? {})]
    for (const toInstallComponent of allInstallComponents) {
      const {name = void 0, __name = void 0} = toInstallComponent
      app.component(name ?? __name ?? undefinedName, toInstallComponent)
    }
  }
  if (otherSecondaryComponentInstallers) {
    for (const [key, comp] of Object.entries(otherSecondaryComponentInstallers)) {
      ;(primaryComponent as dynamic)[key] = comp
    }
  }
  return primaryComponent as unknown as T
}

function _findSlotNodesBy(node: Maybe<SlotNode>, compareFn: (node: NotChildrenSlotNode) => boolean = () => true, result: SlotNode[] = []): SlotNode[] {
  const nodes = maybeArray(node)
  nodes.forEach(n => {
    const r = n.type as Record<string, string>
    n.actualName = r.name || r.__name
    if (compareFn(n)) result.push(n)
    if (n.children && typeof n.children !== 'string') _findSlotNodesBy(n.children as unknown as SlotNode, compareFn, result)
  })
  return result
}

export function findSlotNodesBy(compareFn: (node: NotChildrenSlotNode) => boolean = () => true, arg?: Maybe<SlotNode>): SlotNode[] {
  const res: SlotNode[] = []
  const _m = maybeArray(arg).filter(Boolean) as SlotNode[]
  _m.forEach(ele => res.push(..._findSlotNodesBy(ele, compareFn)))
  return res
}

export function findSlotNodesByName(componentName = '', arg?: Maybe<SlotNode>): SlotNode[] {
  const res: SlotNode[] = []
  const m = maybeArray(arg).filter(Boolean) as SlotNode[]
  m.forEach(ele => res.push(..._findSlotNodesBy(ele, v => v.actualName === componentName)))
  return res
}

export * from './Types'

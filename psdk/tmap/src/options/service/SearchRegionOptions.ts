import type { LatLngDataTyping } from '../../LatLng'
import type { ISearchOptions } from './Base'

export interface SearchRegionOptions extends ISearchOptions {
  /**
   * 检索城市名称， 如北京市，同时支持 adcode（行政区划代码，可精确到区县级），如130681
   */
  cityName: string

  /**
   * 当keyword使用酒店、超市等泛分类关键词时，这类场景大多倾向于搜索附近，传入此经纬度，搜索结果会优先就近地点，体验更优
   */
  referenceLocation?: LatLngDataTyping
}

import type {ISearchOptions} from './Base'

type LatLngDataTyping = TMap.LatLngDataTyping

export interface SearchNearbyOptions extends ISearchOptions {
  /**
   * 搜索中心点的经纬度
   */
  center: LatLngDataTyping
  /**
   * 搜索半径，取值范围：10到1000
   */
  radius: number
}

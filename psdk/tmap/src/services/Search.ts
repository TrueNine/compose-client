import type {TMapService} from '../types'
import type {SearchOptions} from '@/options'

type SearchNearbyOptions = TMapService['SearchNearbyOptions']
type SearchResult = TMapService['SearchResult']
type SearchRegionOptions = TMapService['SearchRegionOptions']

/**
 * # 搜索服务类库
 */
export declare class Search {
  constructor(options: SearchOptions)

  /**
   * ## 搜索某地周围的一个圆形范围符合指定关键字的地点；
   * 搜索完成后resolve状态下返回 {@link SearchResult}
   * reject状态下返回 {@link SearchErrorResult}
   * @param param 搜索入参
   */
  searchNearby(param: SearchNearbyOptions): Promise<SearchResult>

  /**
   * 搜索某地区cityName附近符合给定关键字的地点；
   * 搜索完成后resolve状态下返回 {@link SearchResult}
   * reject状态下返回 {@link SearchErrorResult}
   * @param param 搜索入参
   */
  searchRegion(param: SearchRegionOptions): Promise<SearchResult>

  /**
   * 设置每页返回的结果数量
   * @param pageSize 设置分页大小
   */
  setPageSize(pageSize: number): this

  getPageSize(): number
}

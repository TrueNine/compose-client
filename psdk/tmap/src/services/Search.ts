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

  searchNearby(param: SearchNearbyOptions): Promise<SearchResult>

  searchRegion(param: SearchRegionOptions): Promise<SearchResult>

  setPageSize(pageSize: number): this

  getPageSize(): number
}

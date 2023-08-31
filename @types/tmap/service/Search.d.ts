import {TMap} from '../index'
import {Nullable} from '@compose/api-model'

export interface _ErrorResult {
  status: number
}

export interface _SearchOptions {
  pageSize: number
}

export interface _SearchResult {
  /**
   * 状态码，0为正常，其它为异常，详细请参阅
   * [状态码说明](https://lbs.qq.com/service/webService/webServiceGuide/status)
   */
  status: number
  /**
   * 状态说明
   */
  message: string
  count: number
  /**
   * 搜索结果POI数组，每项为一个POI对象
   */
  data: {
    /**
     * POI（地点）唯一标识
     */
    id: string
    /**
     * POI（地点）名称
     */
    title: string
    /**
     * 地址（不含省市区信息的短地址）
     */
    address: string

    /**
     * 坐标
     */
    location: TMap.LatLng
    /**
     * 电话
     */
    tel?: Nullable<string>
    /**
     * 分类
     */
    category?: Nullable<string>
    /**
     * POI类型，值说明：0:普通POI / 1:公交车站 / 2:地铁站 / 3:公交线路 / 4:行政区划
     */
    type?: number
    /**
     * 距离，单位： 米，在周边搜索、城市范围搜索传入定位点时返回
     */
    _distance?: number
    ad_info?: {
      /**
       * 行政区划代码，详见：[行政区划码说明](https://lbs.qq.com/service/webService/webServiceGuide/webServiceDistrict#6)
       */
      adcode: number
      /**
       * 省
       */
      province: string
      /**
       * 市
       */
      city: string
      /**
       * 区
       */
      district: string
    }
  }[]
}

export interface _SearchNearbyParams {
  /**
   * 搜索关键字
   */
  keyword: string
  /**
   * 搜索中心点的经纬度
   */
  center: TMap.LatLng
  /**
   * 搜索半径，取值范围：10到1000
   */
  radius: number
  /**
   * 当前范围无结果时，是否自动扩大范围，取值：
   * false：不扩大；
   * true [默认]：自动扩大范围（依次按照按1公里、2公里、5公里，最大到全城市范围搜索）
   * @default false
   */
  autoExtend?: boolean
  /**
   * 1. 指定分类筛选，语句格式为：
   * category=分类名1,分类名2
   * 最多支持5个分类词（支持的分类请参考：[POI分类表](https://lbs.qq.com/service/webService/webServiceGuide/webServiceAppendix)）
   * 2. 排除指定分类，语句格式为：
   * category<>分类名1,分类名2
   * 最多支持5个分类词（支持的分类请参考：[POI分类表](https://lbs.qq.com/service/webService/webServiceGuide/webServiceAppendix)）
   * 3. 筛选有电话的地点：tel<>null
   */
  filter?: string
  /**
   * 第x页，默认第1页
   * @default 1
   */
  pageIndex?: number
  /**
   * 签名校验
   * 开启WebServiceAPI签名校验的必传参数，只需要传入生成的SK字符串即可，不需要进行MD5加密操作
   */
  servicesk?: string
}

/**
 * # 搜索服务类库
 */
export class _Search {
  constructor(options: TMap.service.SearchOptions)

  /**
   * ## 搜索某地周围的一个圆形范围符合指定关键字的地点；
   * 搜索完成后resolve状态下返回 {@link _SearchResult}
   * reject状态下返回 {@link _ErrorResult}
   * @param param 搜索入参
   */
  searchNearby(param: TMap.service.SearchNearbyParams): Promise<TMap.service.SearchResult | TMap.service.ErrorResult | undefined>
}

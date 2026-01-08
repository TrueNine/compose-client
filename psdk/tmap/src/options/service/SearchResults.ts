import type {LatLng} from '../../LatLng'

export interface SearchResult {
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
    location: LatLng
    /**
     * 电话
     */
    tel?: string | null
    /**
     * 分类
     */
    category?: string | null
    /**
     * POI类型，值说明：0:普通POI / 1:公交车站 / 2:地铁站 / 3:公交线路 / 4:行政区划
     */
    type?: number
    /**
     * 距离，单位： 米，在周边搜索、城市范围搜索传入定位点时返回
     */
    _distance?: number
    ad_info: {
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

export interface SearchErrorResult {
  status: number
}

export interface ISearchOptions {
  /**
   * 搜索关键字
   */
  keyword: string
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

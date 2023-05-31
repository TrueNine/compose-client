/**
 * ## 分类查询参数
 */
export interface GetCategoryRequestParam {
  title?: string
  ordered?: number
  level?: number
}

/**
 * ## 保存分类子项
 */
export interface PostCategoryRequestParam {
  title: string
  ordered?: number
  doc?: string
  parentId?: string
}

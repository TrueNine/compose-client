import {Asyncable, Nullable} from './DataType'
import {isEmpty} from '../tools'

/**
 * 分页参数入参请求
 */
export interface PagedRequestParam {
  offset: number
  pageSize: number
}

/**
 * ## PagedRequestParam 的简写形式
 */
export type Pq = PagedRequestParam

export const PagedWrapper = {
  DEFAULT_MAX: {
    offset: 0,
    pageSize: 42
  } as PagedRequestParam
}

/**
 * ## PagedWrapper 的简写形式
 */
export const Pw = PagedWrapper

/**
 * 分页后数据统一返回
 */
export interface PagedResponseResult<D> {
  dataList?: D[]
  total: number
  size: number
  pageSize: number
  offset: number
}

/**
 * ## PagedResponseResult 的简写形式
 */
export type Pr<T> = PagedResponseResult<T>

/**
 * 分页后随参数
 */
export const PageablePageSizes = [
  {
    label: '5 每页',
    value: 5
  },
  {
    label: '10 每页',
    value: 10
  },
  {
    label: '15 每页',
    value: 15
  },
  {
    label: '20 每页',
    value: 20
  },
  {
    label: '30 每页',
    value: 30
  },
  {
    label: '42 每页',
    value: 42
  }
]

/**
 * # 遍历分页
 * - API 返回的所有数据，并将所有数据作为数组返回。
 * @param loopFn 回调函数，接受一个分页请求参数并返回一个 PagedResponseResult 或一个解析为 PagedResponseResult 的 Promise。
 * @param loopPq 初始分页请求参数。
 * @returns 所有分页 API 返回的数据的数组。
 */
export async function loopPageAll<T>(loopFn: (loopPq: Pq) => Asyncable<Nullable<Pr<T>>>, initPageParam: Pq = Pw.DEFAULT_MAX) {
  const {pageSize: initPageSize = 0, dataList: initDataList = [], total: initTotal = 0} = (await loopFn(initPageParam)) ?? {pageSize: 0, dataList: [], total: 0}
  if (isEmpty(initDataList) || initPageSize <= 1 || !initDataList || initTotal === 0 || initTotal <= initPageParam.pageSize) return initDataList
  const resultDataList: T[] = [...initDataList]
  let nextPq: Pq | null = {...initPageParam, offset: initPageParam.offset + 1}
  while (nextPq !== null) {
    const {dataList = []} = (await loopFn(nextPq)) ?? {dataList: []}
    resultDataList.push(...dataList)
    nextPq = (nextPq.offset + 1) * nextPq.pageSize < initTotal ? {...nextPq, offset: nextPq.offset + 1} : null
  }
  return resultDataList
}

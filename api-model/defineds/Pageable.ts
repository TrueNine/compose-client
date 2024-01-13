import type {Asyncable, nil, Nullable, Pq, Pr} from '@compose/api-types'
import {Pw} from '@compose/api-types'

import {isEmpty} from '../tools'

/**
 * # 遍历分页
 * - API 返回的所有数据，并将所有数据作为数组返回。
 * @param loopFn 回调函数，接受一个分页请求参数并返回一个 PagedResponseResult 或一个解析为 PagedResponseResult 的 Promise。
 * @param initPageParam 初始分页请求参数。
 * @returns 所有分页 API 返回的数据的数组。
 */
export async function loopPageAll<T>(loopFn: (loopPq: Pq) => Asyncable<Nullable<Pr<T>>>, initPageParam: Pq = Pw.DEFAULT_MAX) {
  const {
    pageSize: initPageSize = 0,
    dataList: initDataList = [],
    total: initTotal = 0
  } = (await loopFn(initPageParam)) ?? {
    pageSize: 0,
    dataList: [],
    total: 0
  }
  if (isEmpty(initDataList) || initPageSize <= 1 || !initDataList || initTotal === 0 || initTotal <= (initPageParam?.pageSize ?? 0)) return initDataList
  const resultDataList: T[] = [...initDataList]
  let nextPq: nil<Pq> = {...initPageParam, offset: (initPageParam?.offset ?? 0) + 1}
  while (nextPq !== null) {
    const {dataList = []} = (await loopFn(nextPq)) ?? {dataList: []}
    resultDataList.push(...dataList)
    nextPq = ((nextPq?.offset ?? 0) + 1) * (nextPq?.pageSize ?? 0) < initTotal ? {...nextPq, offset: (nextPq?.offset ?? 0) + 1} : null
  }
  return resultDataList
}

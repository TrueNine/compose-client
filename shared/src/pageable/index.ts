import type { asyncable, nil, Pq, Pr, task } from '@truenine/types'

import { Pw } from '@/consts'
import { isNil } from '@/tools'

/**
 * ## 遍历所有分页结果
 * - API 返回的所有数据，并将所有数据作为数组返回。
 * @param loopFn 回调函数，接受一个分页请求参数并返回一个 PagedResponseResult 或一个解析为 PagedResponseResult 的 Promise。
 * @param initPageParam 初始分页请求参数。
 * @returns 所有分页 API 返回的数据的数组。
 */
export async function loopPageAll<T>(loopFn: (loopPq: Pq) => asyncable<nil<Pr<T>>>, initPageParam: Pq = Pw.DEFAULT_MAX): task<T[]> {
  const {
    p: initPageSize = 0,
    d: initDataList = [],
    t: initTotal = 0,
  } = (await loopFn(initPageParam)) ?? {
    p: 0,
    d: [],
    t: 0,
  }
  if (isNil(initDataList) || initPageSize <= 1 || initTotal === 0 || initTotal <= (initPageParam.s ?? 0)) {
    return initDataList
  }
  const resultDataList: T[] = [...initDataList]
  let nextPq: nil<Pq> = { ...initPageParam, o: (initPageParam.o ?? 0) + 1 }
  while (nextPq !== null) {
    const { d = [] } = (await loopFn(nextPq)) ?? { d: [] }
    resultDataList.push(...d)
    nextPq = ((nextPq.o ?? 0) + 1) * (nextPq.s ?? 0) < initTotal ? { ...nextPq, o: (nextPq.o ?? 0) + 1 } : null
  }
  return resultDataList
}

/**
 * ## 数组转分页
 * @param arr 数组
 * @param pq 分页参数
 */
export function arrayToPage<T>(arr: T[], pq: Pq = Pw.DEFAULT_MAX): Pr<T> {
  if (!arr.length) {
    return Pw.empty()
  }

  const minPageSize = Math.min(arr.length, pq.s ?? arr.length)
  const safeOffset = Math.max(0, pq.o ?? 0)

  if (pq.s === 0) {
    return {
      d: arr,
      p: 1,
      t: arr.length,
    }
  }

  const pageSize = Math.ceil(arr.length / minPageSize)
  if (pq.o === 0) {
    return {
      d: arr.slice(0, minPageSize),
      p: pageSize,
      t: arr.length,
    }
  }
  const sliceStart = Math.min(safeOffset * minPageSize, arr.length)
  const sliceEnd = Math.min(sliceStart + minPageSize, arr.length)
  return {
    d: arr.slice(sliceStart, sliceEnd),
    p: pageSize,
    t: arr.length,
  }
}

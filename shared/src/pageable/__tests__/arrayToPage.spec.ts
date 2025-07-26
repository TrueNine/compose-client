import type { Pq } from '@truenine/types'
import { describe, expect, it } from 'vitest'
import { Pw } from '@/consts'
import { arrayToPage } from '../index'

// 辅助函数：生成分页参数
function pq(o?: number, s?: number): Pq {
  return { o, s } as Pq
}

describe('arrayToPage', () => {
  it('空数组应返回空分页', () => {
    expect(arrayToPage([], pq(0, 10))).toEqual(Pw.empty())
  })

  it('使用默认参数 Pw.DEFAULT_MAX', () => {
    const arr = Array.from({ length: 50 }, (_, i) => i + 1)
    const result = arrayToPage(arr)
    const defaultSize = Pw.DEFAULT_MAX.s ?? 10
    expect(result.d).toEqual(arr.slice(0, defaultSize))
    expect(result.p).toBe(Math.ceil(50 / defaultSize))
    expect(result.t).toBe(50)
  })

  it('分页参数为默认，数组长度小于分页大小', () => {
    const arr = [1, 2, 3]
    const result = arrayToPage(arr, pq(0, 10))
    expect(result.d).toEqual(arr)
    expect(result.p).toBe(1)
    expect(result.t).toBe(3)
  })

  it('分页参数为默认，数组长度大于分页大小', () => {
    const arr = Array.from({ length: 50 }, (_, i) => i + 1)
    const result = arrayToPage(arr, pq(0, 10))
    expect(result.d).toEqual(arr.slice(0, 10))
    expect(result.p).toBe(Math.ceil(50 / 10))
    expect(result.t).toBe(50)
  })

  it('分页参数 s=0，返回全部数据', () => {
    const arr = [1, 2, 3, 4, 5]
    const result = arrayToPage(arr, pq(0, 0))
    expect(result.d).toEqual(arr)
    expect(result.p).toBe(1)
    expect(result.t).toBe(5)
  })

  it('分页参数 o>0，返回正确的切片', () => {
    const arr = Array.from({ length: 20 }, (_, i) => i + 1)
    const result = arrayToPage(arr, pq(1, 5))
    expect(result.d).toEqual(arr.slice(5, 10))
    expect(result.p).toBe(4)
    expect(result.t).toBe(20)
  })

  it('分页参数 o 超出范围，返回空数组', () => {
    const arr = [1, 2, 3]
    const result = arrayToPage(arr, pq(10, 2))
    expect(result.d).toEqual([])
    expect(result.p).toBe(2)
    expect(result.t).toBe(3)
  })
})

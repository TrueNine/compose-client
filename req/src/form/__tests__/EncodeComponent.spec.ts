import {describe, expect, it} from 'vitest'
import {decodeHash, encodeQueryParam, queryHash, queryParam, SearchParam} from '../EncodeComponent'

describe('searchParam', () => {
  it('append/get/has/size/values/keys', () => {
    const sp = new SearchParam()
    expect(sp.size).toBe(0)
    sp.append('a', 1)
    sp.append('b', '2')
    expect(sp.size).toBe(2)
    expect(sp.get('a')).toBe(1)
    expect(sp.get('b')).toBe('2')
    expect(sp.has('a')).toBe(true)
    expect([...sp.keys()]).toEqual(['a', 'b'])
    expect([...sp.values()]).toEqual([1, '2'])
  })

  it('delete/clear', () => {
    const sp = new SearchParam()
    sp.append('a', 1)
    sp.append('b', 2)
    expect(sp.size).toBe(2)
    expect(sp.delete('a')).toBe(true)
    expect(sp.size).toBe(1)
    sp.clear()
    expect(sp.size).toBe(0)
  })

  it('toString 缓存', () => {
    const sp = new SearchParam()
    sp.append('a', '1')
    sp.append('b', '2')
    const s1 = sp.toString()
    const s2 = sp.toString()
    expect(s1).toBe('a=1&b=2')
    expect(s2).toBe(s1)
    sp.append('c', '3')
    expect(sp.toString()).toBe('a=1&b=2&c=3')
  })

  it('appendAll', () => {
    const sp = new SearchParam()
    sp.appendAll({a: 1, b: '2'})
    expect(sp.get('a')).toBe(1)
    expect(sp.get('b')).toBe('2')
  })

  it('fromString', () => {
    const sp = SearchParam.fromString('?a=1&b=2')
    expect(sp.get('a')).toBe('1')
    expect(sp.get('b')).toBe('2')
    const sp2 = SearchParam.fromString('')
    expect(sp2.size).toBe(0)
  })

  it('clone', () => {
    const sp = new SearchParam()
    sp.append('a', 1)
    const sp2 = sp.clone()
    expect(sp2.get('a')).toBe(1)
    sp2.append('b', 2)
    expect(sp.get('b')).toBeUndefined()
    expect(sp2.get('b')).toBe(2)
  })
})

describe('encodeQueryParam', () => {
  it('基本用例', () => {
    expect(encodeQueryParam({a: 1, b: '2'})).toBe('?a=1&b=2')
    expect(encodeQueryParam({tags: ['a', 'b']})).toBe('?tags=a&tags=b')
    expect(encodeQueryParam({name: '测试'})).toBe('?name=%E6%B5%8B%E8%AF%95')
  })
  it('多对象合并', () => {
    expect(encodeQueryParam({a: 1}, {b: 2})).toBe('?a=1&b=2')
  })
  it('空对象/无效参数', () => {
    expect(encodeQueryParam()).toBe('')
    expect(encodeQueryParam(null)).toBe('')
    expect(encodeQueryParam({})).toBe('')
  })
  it('嵌套对象只处理一层', () => {
    expect(encodeQueryParam({a: {b: 1}})).toBe('?a=')
  })
})

describe('queryParam', () => {
  it('基本用例', () => {
    expect(queryParam({a: 1, b: '2'})).toBe('?a=1&b=2')
    expect(queryParam({tags: ['a', 'b']})).toBe('?tags=a&tags=b')
    expect(queryParam({name: '测试'})).toBe('?name=测试')
  })
  it('多对象合并', () => {
    expect(queryParam({a: 1}, {b: 2})).toBe('?a=1&b=2')
  })
  it('空对象/无效参数', () => {
    expect(queryParam()).toBe('')
    expect(queryParam(null)).toBe('')
    expect(queryParam({})).toBe('')
  })
  it('嵌套对象只处理一层', () => {
    expect(queryParam({a: {b: 1}})).toBe('?a=')
  })
})

describe('queryHash', () => {
  it('基本用例', () => {
    expect(queryHash({a: 1})).toBe('#a=1')
    expect(queryHash({tags: ['a', 'b']})).toBe('#tags=a&tags=b')
  })
  it('空对象', () => {
    expect(queryHash()).toBe('')
    expect(queryHash({})).toBe('')
  })
})

describe('decodeHash', () => {
  it('基本用例', () => {
    expect(decodeHash('#a=1&b=2')).toEqual({a: '1', b: '2'})
    expect(decodeHash('a=1&b=2')).toEqual({a: '1', b: '2'})
  })
  it('空字符串/无效输入', () => {
    expect(decodeHash('')).toEqual({})
    expect(decodeHash(void 0)).toEqual({})
    expect(decodeHash(null)).toEqual({})
  })
  it('缺失值', () => {
    expect(decodeHash('#a=1&b')).toEqual({a: '1', b: ''})
  })
  it('多余#', () => {
    expect(decodeHash('##a=1')).toEqual({'#a': '1'})
  })
})

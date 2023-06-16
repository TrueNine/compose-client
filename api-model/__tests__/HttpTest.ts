import {queryParam} from '../src/tools/Http'

test('测试 http url 编码', () => {
  expect(queryParam({a: 1, b: '2'})).toBe('?a=1&b=2')
})

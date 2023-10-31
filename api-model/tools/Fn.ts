/**
 * # 环绕调用
 * @param supplier 提供一个返回值的函数
 * @param before 前置调用
 * @param after 后置调用
 */
export function around<T>(supplier: () => T, before?: () => void, after?: () => void): T {
  before?.()
  const r = supplier()
  after?.()
  return r
}

/**
 * ## 执行函数的同时，改变某个状态
 *
 * @param fn 执行带返回的函数
 * @param switchBy 状态调用函数
 * @returns 执行结果
 */
export function switchTo<T>(fn: () => T, switchBy: () => void): T {
  switchBy()
  const r = fn()
  if (r instanceof Promise) {
    r.then(er => {
      switchBy()
      return er
    })
  } else switchBy()

  return r
}

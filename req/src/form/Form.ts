import {STR_EMPTY} from '@compose/api-model'
import type {dynamic} from '@compose/api-types'

export function toFormPathData(formContent: dynamic, parentExpression: string = ''): {name: string; value: string | Blob}[] {
  const _resultArr: {name: string; value: string | Blob}[] = []
  Object.entries(formContent).forEach(([k, v]) => {
    if (v != null && v !== STR_EMPTY) {
      if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
        _resultArr.push({name: `${parentExpression}.${k}`, value: v.toString()})
      } else if (Array.isArray(v)) {
        if (v.length > 0) {
          const v1 = v.filter(e1 => e1 != null && e1 != STR_EMPTY)
          const isObjArray = v1.every(e1 => typeof e1 === 'object')
          const isBlobArray = v1.every(e1 => e1 instanceof Blob)
          if (isObjArray && !isBlobArray) {
            v1.forEach((arrayEntity, i) => {
              _resultArr.push(...toFormPathData(arrayEntity, `${parentExpression}.${k}[${i}]`))
            })
          } else if (isBlobArray) {
            v1.forEach((arrayEntity, i) => {
              _resultArr.push({
                name: `${parentExpression}.${k}[${i}]`,
                value: arrayEntity
              })
            })
          } else {
            _resultArr.push({
              name: `${parentExpression}.${k}`,
              value: v1.join(',')
            })
          }
        }
      } else if (v instanceof Blob) {
        _resultArr.push({name: `${parentExpression}.${k}`, value: v})
      } else if (typeof v === 'object') {
        _resultArr.push(...toFormPathData(v, `${parentExpression}.${k}`))
      }
    }
  })
  return _resultArr.map(it => {
    if (it.name.startsWith('.')) it.name = it.name.slice(1)
    return it
  })
}

export function form(formContent: object): FormData {
  if (!formContent) return new FormData()
  const f = new FormData()

  toFormPathData(formContent)?.forEach(it => {
    f.append(it.name, it.value)
  })

  return f
}

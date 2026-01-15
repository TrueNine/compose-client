import {STR_EMPTY} from '@truenine/shared'

interface FormDataItem {
  name: string
  value: string | Blob
}

export function toFormPathData(formContent: Record<string, unknown>, parentExpression = ''): FormDataItem[] {
  const _resultArr: FormDataItem[] = []
  Object.entries(formContent).forEach(([k, v]) => {
    if (v != null && v !== STR_EMPTY) {
      if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') _resultArr.push({name: `${parentExpression}.${k}`, value: v.toString()})
      else if (Array.isArray(v) || v instanceof Uint8Array || v instanceof Uint16Array || v instanceof Uint32Array) {
        if (v.length > 0) {
          const v1 = v.filter(e1 => e1 === 0 || (e1 != null && e1 !== STR_EMPTY))
          const isObjArray = v1.every(e1 => e1 !== null && typeof e1 === 'object')
          const isBlobArray = v1.every(e1 => e1 instanceof Blob)
          if (isObjArray && !isBlobArray) {
            v1.forEach((arrayEntity, i) => {
              if (arrayEntity !== null && typeof arrayEntity === 'object') {
                _resultArr.push(...toFormPathData(arrayEntity as Record<string, unknown>, `${parentExpression}.${k}[${i.toString()}]`))
              }
            })
          }
          else if (isBlobArray) {
            v1.forEach((arrayEntity, i) => {
              if (arrayEntity instanceof Blob) _resultArr.push({name: `${parentExpression}.${k}[${i.toString()}]`, value: arrayEntity})
            })
          }
          else _resultArr.push({name: `${parentExpression}.${k}`, value: v1.join(',')})
        }
      }
      else if (v instanceof Blob) _resultArr.push({name: `${parentExpression}.${k}`, value: v})
      else if (v !== null && typeof v === 'object') _resultArr.push(...toFormPathData(v as Record<string, unknown>, `${parentExpression}.${k}`))
    }
  })
  return _resultArr.map(it => {
    if (it.name.startsWith('.')) it.name = it.name.slice(1)
    return it
  })
}

export function form(formContent: Record<string, unknown>): FormData {
  const f = new FormData()

  toFormPathData(formContent).forEach(it => f.append(it.name, it.value))

  return f
}

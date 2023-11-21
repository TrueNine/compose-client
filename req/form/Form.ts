import {STR_EMPTY} from '@compose/compose-types'

export function form(formContent: object): FormData {
  if (!formContent) return new FormData()
  const f = new FormData()
  Object.entries(formContent).forEach(([k, v]) => {
    if (v != null && v != STR_EMPTY) {
      if (Array.isArray(v)) f.append(k, v.map(String).join(','))
      if (v instanceof Blob) f.append(k, v)
      else f.append(k, v.toString())
    }
  })
  return f
}

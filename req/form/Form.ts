import {STR_EMPTY} from '@compose/compose-types'

export function form(formContent: object): FormData {
  if (!formContent) return new FormData()
  const f = new FormData()
  Object.entries(formContent).forEach(([k, v]) => {
    if (v != null && v !== STR_EMPTY) {
      if (Array.isArray(v)) {
        const ease = v.filter(e => e != null)
        if (ease.length > 0) {
          let isObj = false
          ease.forEach((e, i) => {
            if (!isObj && typeof e === 'object') isObj = true
            Object.entries(e).forEach(([ek, ev]) => {
              if (ev != null && ev !== STR_EMPTY) {
                if (ev instanceof Blob) f.append(`${k}[${i}].${ek}`, ev)
                else f.append(`${k}[${i}].${ek}`, ev.toString())
              }
            })
          })
        }
      } else if (v instanceof Blob) f.append(k, v)
      else f.append(k, v.toString())
    }
  })
  return f
}

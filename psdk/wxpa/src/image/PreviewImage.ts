import type { HttpUrl } from '@compose/types'

import type { BaseOption } from '../common'

export interface PreviewImageOption extends BaseOption {
  current: HttpUrl
  urls: HttpUrl[]
}

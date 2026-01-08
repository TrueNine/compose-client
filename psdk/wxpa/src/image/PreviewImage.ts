import type {HttpUrl} from '@truenine/types'

import type {BaseOption} from '../common'

export interface PreviewImageOption extends BaseOption {
  current: HttpUrl
  urls: HttpUrl[]
}

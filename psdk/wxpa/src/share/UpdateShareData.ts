import type {HttpUrl} from '@truenine/types'

import type {BaseOption} from '@/common'

export interface UpdateAppMessageShareDataOption extends BaseOption {
  title: string
  desc?: string
  link: HttpUrl
  imgUrl?: HttpUrl
}

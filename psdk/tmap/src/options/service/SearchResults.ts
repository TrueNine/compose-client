import type {LatLng} from '../../LatLng'

export interface SearchResult {
  status: number
  message: string
  count: number
  data: {
    id: string
    title: string
    address: string

    location: LatLng
    tel?: string | null
    category?: string | null
    type?: number
    _distance?: number
    ad_info: {
      adcode: number
      province: string
      city: string
      district: string
    }
  }[]
}

export interface SearchErrorResult {
  status: number
}

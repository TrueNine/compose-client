import _cloneDeep from 'lodash-es/cloneDeep'
import _cloneDeepWith from 'lodash-es/cloneDeepWith'
import _isEqual from 'lodash-es/isEqual'
import _merge from 'lodash-es/merge'

export {}

export const cloneDeep = _cloneDeep
export const merge = _merge
export const isEqual = _isEqual
export const cloneDeepWith: typeof _cloneDeepWith = _cloneDeepWith

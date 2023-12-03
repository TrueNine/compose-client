import {expect, test} from 'vitest'

import {RouteStream} from '../../'
import {resolveRouters} from '../../references'
import {toRouteTable} from '../../defineds'

import {RouteTable} from './RouteOptions.data'

test('RouteStream.isAllowPermissions', async () => {
  const stream = new RouteStream(RouteTable)
  expect(stream.isAllowPermissions('/system')).toBe(false)
  expect(stream.isAllowPermissions('/')).toBe(true)
  expect(stream.isAllowPermissions('/goods/addPhysical')).toBe(false)
  const stream2 = new RouteStream(RouteTable, {permissions: ['ADMIN']})
  expect(stream2.isAllowPermissions('/goods/addPhysical')).toBe(true)
  expect(stream2.isAllowPermissions('/goods/addPhysical?a=1')).toBe(true)
})

test('RouteStream.matchClip', async () => {
  const stream = new RouteStream(RouteTable)
  console.log(stream.matchClip({}))
})

test('toRouteTable', async () => {
  const routes = resolveRouters()
  const table = toRouteTable(routes)
  console.log(table)
})

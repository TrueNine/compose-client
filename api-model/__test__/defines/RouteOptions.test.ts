import {expect, test} from 'vitest'

import {routeOptionStream} from '../../'

import {RouteTable} from './RouteOptions.data'

test('routeOptionStream.matchClip', () => {
  const stream = routeOptionStream(RouteTable)
  const matched = stream.matchClip({
    roles: ['ADMIN'],
    permissions: ['ADMIN']
  })

  const a = routeOptionStream(matched).flatRouteOptions()
  expect(
    a.every(e => e.hasPermissions || e.requirePermissions),
    '残留有权限菜单选项'
  ).toBe(false)

  const matchedNone = stream.matchClip()
  const b = routeOptionStream(matchedNone).flatRouteOptions()
  expect(
    b.every(e => e.hasPermissions || e.requirePermissions),
    '残留有权限菜单选项'
  ).toBe(false)
})

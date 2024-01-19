import {test} from 'vitest'

import {generateMenu, resolveRouters} from '../../references'

test('test generateMenu', () => {
  const routes = resolveRouters()
  const menu = generateMenu(routes, route => {
    console.log(route.fullPath)
    return true
  })
  const menu2 = generateMenu(
    routes,
    route => {
      return true
    },
    'a'
  )
  console.log(menu)
  console.log(menu2)
})

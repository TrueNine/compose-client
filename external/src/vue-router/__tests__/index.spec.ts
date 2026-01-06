import type { RouteRecordRaw } from 'vue-router'
import { describe, expect, it } from 'vitest'
import { generateMenu } from '../index'
import routers from './routers.json'

// 选取部分典型路由用于测试
const rootRoutes: RouteRecordRaw[] = routers as RouteRecordRaw[]
const aRoutes: RouteRecordRaw[] = (rootRoutes.find((r: RouteRecordRaw) => r.path === '/a')?.children ?? [])
const wxpaRoutes: RouteRecordRaw[] = (rootRoutes.find((r: RouteRecordRaw) => r.path === '/wxpa')?.children ?? [])

describe('generateMenu - routers.json 数据', (): void => {
  it('应该正确转换根路由', () => {
    const menu = generateMenu(rootRoutes)
    expect(menu.length).toBeGreaterThan(0)
    expect(menu[0]).toMatchObject({
      path: '/',
      name: '首页',
      fullPath: '',
    })
  })

  it('应该正确转换 /a 下的嵌套路由', () => {
    const menu = generateMenu(aRoutes)
    expect(menu.length).toBeGreaterThan(0)
    // 检查典型子路由
    const audit = menu.find(m => m.path === 'audit')
    expect(audit).toBeDefined()
    expect(audit?.sub?.length).toBeGreaterThan(0)
    const enterprises = audit?.sub?.find(m => m.path === 'enterprises')
    expect(enterprises).toMatchObject({
      name: '企业审核',
      path: 'enterprises',
    })
  })

  it('应该正确应用路由匹配函数', () => {
    const matchFn = (route: RouteRecordRaw): boolean => route.meta?.title === '黑名单'
    const menu = generateMenu(aRoutes, matchFn)
    expect(menu.length).toBe(1)
    expect(menu[0].name).toBe('黑名单')
  })

  it('应该正确应用路径裁剪', () => {
    const menu = generateMenu(aRoutes, void 0, 'sys')
    expect(menu.length).toBeGreaterThan(0)
    expect(menu[0].name).toBe('权限管理')
  })

  it('应该正确处理空路由数组', () => {
    const menu = generateMenu([])
    expect(menu).toHaveLength(0)
  })

  it('应该正确处理 /wxpa 下的多级嵌套', () => {
    const menu = generateMenu(wxpaRoutes)
    expect(menu.length).toBeGreaterThan(0)
    const me = menu.find(m => m.path === 'me')
    expect(me?.sub?.some(s => s.path === 'certs')).toBe(true)
  })
})

describe('generateMenu - path为空的子路由特殊处理', () => {
  const DummyComponent: () => null = () => null

  it('children 只有 path "" 时不生成 sub', () => {
    const routes: RouteRecordRaw[] = [
      {
        path: 'only-index',
        component: DummyComponent,
        children: [
          { path: '', meta: { title: '首页' }, component: DummyComponent },
        ],
        meta: { title: '父级' },
      },
    ]
    const menu = generateMenu(routes)
    expect(menu[0].name).toBe('首页')
    expect(menu[0].sub).toBeUndefined()
  })

  it('children 同时有 path "" 和其他路由时，path "" 不应出现在 sub，meta/title 合并到父级', () => {
    const routes: RouteRecordRaw[] = [
      {
        path: 'mix',
        component: DummyComponent,
        children: [
          { path: '', meta: { title: '首页', extra: 'index' }, component: DummyComponent },
          { path: 'other', meta: { title: '其他' }, component: DummyComponent },
        ],
        meta: { title: '父级' },
      },
    ]
    const menu = generateMenu(routes)
    expect(menu[0].name).toBe('首页')
    expect(menu[0].meta?.extra).toBe('index')
    expect(menu[0].sub).toHaveLength(1)
    expect(menu[0].sub?.[0]?.path).toBe('other')
  })

  it('path "" 路由自身有 children 时，其 children 应合并到父级 sub', () => {
    const routes: RouteRecordRaw[] = [
      {
        path: 'with-index-children',
        component: DummyComponent,
        children: [
          {
            path: '',
            meta: { title: '首页' },
            component: DummyComponent,
            children: [
              { path: 'sub1', meta: { title: '子1' }, component: DummyComponent },
              { path: 'sub2', meta: { title: '子2' }, component: DummyComponent },
            ],
          },
          { path: 'other', meta: { title: '其他' }, component: DummyComponent },
        ],
        meta: { title: '父级' },
      },
    ]
    const menu = generateMenu(routes)
    expect(menu[0].name).toBe('首页')
    // sub 应包含 sub1、sub2、other
    const subPaths = Array.isArray(menu[0].sub) ? menu[0].sub.map(s => s.path) : []
    expect(subPaths).toContain('sub1')
    expect(subPaths).toContain('sub2')
    expect(subPaths).toContain('other')
  })
})

describe('generateMenu - meta.hidden 处理', () => {
  const DummyComponent: () => null = () => null

  it('路由的 meta.hidden 为 true 时不应出现在菜单中', () => {
    const routes: RouteRecordRaw[] = [
      {
        path: 'visible',
        component: DummyComponent,
        meta: { title: '可见路由' },
      },
      {
        path: 'hidden',
        component: DummyComponent,
        meta: { title: '隐藏路由', hidden: true },
      },
    ]
    const menu = generateMenu(routes)
    expect(menu).toHaveLength(1)
    expect(menu[0].path).toBe('visible')
    expect(menu[0].name).toBe('可见路由')
  })

  it('父路由 meta.hidden 为 true 时，其所有子路由都不应出现在菜单中', () => {
    const routes: RouteRecordRaw[] = [
      {
        path: 'parent',
        component: DummyComponent,
        meta: { title: '父路由', hidden: true },
        children: [
          {
            path: 'child1',
            component: DummyComponent,
            meta: { title: '子路由1' },
          },
          {
            path: 'child2',
            component: DummyComponent,
            meta: { title: '子路由2' },
          },
        ],
      },
    ]
    const menu = generateMenu(routes)
    expect(menu).toHaveLength(0)
  })

  it('子路由 meta.hidden 为 true 时，不影响其他子路由显示', () => {
    const routes: RouteRecordRaw[] = [
      {
        path: 'parent',
        component: DummyComponent,
        meta: { title: '父路由' },
        children: [
          {
            path: 'visible',
            component: DummyComponent,
            meta: { title: '可见子路由' },
          },
          {
            path: 'hidden',
            component: DummyComponent,
            meta: { title: '隐藏子路由', hidden: true },
          },
        ],
      },
    ]
    const menu = generateMenu(routes)
    expect(menu).toHaveLength(1)
    expect(menu[0].sub).toHaveLength(1)
    expect(menu[0].sub?.[0].path).toBe('visible')
  })

  it('meta.hidden 为非 true 值时不应影响菜单生成', () => {
    const routes: RouteRecordRaw[] = [
      {
        path: 'test1',
        component: DummyComponent,
        meta: { title: '测试1', hidden: false },
      },
      {
        path: 'test2',
        component: DummyComponent,
        meta: { title: '测试2' },
      },
      {
        path: 'test3',
        component: DummyComponent,
        meta: { title: '测试3', hidden: null },
      },
    ]
    const menu = generateMenu(routes)
    expect(menu).toHaveLength(3)
  })
})

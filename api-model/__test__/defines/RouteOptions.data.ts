import type {RouteOption} from '@compose/compose-types'

// @unocss-include
export const RouteTable: RouteOption[] = [
  {
    name: 'app',
    uri: '/',
    hidden: true,
    requireLogin: true
  },
  {
    name: '错误页面',
    uri: 'error',
    hidden: true
  },
  {
    name: '概览',
    uri: 'all',
    iconName: 'i-mdi-view-dashboard-outline',
    requireLogin: true,
    requirePermissions: ['ADMIN']
  },
  {
    name: '数据统计',
    uri: 'statistics',
    requireLogin: true,
    iconName: 'i-mdi-beaker',
    requirePermissions: ['ADMIN'],
    sub: [
      {
        name: '数据总览',
        iconName: 'i-mdi-chart-line',
        uri: 'all',
        tags: ['开发中']
      },
      {
        name: '网点端',
        iconName: 'i-mdi-account-outline',
        uri: 'endpoint',
        tags: ['开发中']
      },
      {
        name: '渠道端',
        iconName: 'i-mdi-truck-minus',
        uri: 'provider',
        tags: ['开发中']
      },
      {
        name: '开发/维护端',
        uri: 'dev',
        iconName: 'i-mdi-devices',
        tags: ['开发中']
      }
    ]
  },
  {
    name: '工作台',
    uri: 'workbench',
    iconName: 'i-mdi-monitor-dashboard',
    sub: [
      {
        name: '管理',
        uri: 'admin',
        iconName: 'i-mdi-security',
        requireLogin: true,
        requirePermissions: ['ADMIN'],
        tags: ['开发中']
      },
      {
        name: '客服',
        iconName: 'i-mdi-face-agent',
        tags: ['开发中'],
        uri: 'customer'
      },
      {
        name: '渠道',
        iconName: 'i-mdi-store',
        uri: 'channel',
        tags: ['开发中']
      },
      {
        name: '网点',
        iconName: 'i-mdi-access-point',
        uri: 'endpoint',
        tags: ['开发中']
      },
      {
        name: '分销组',
        uri: 'distribution/group',
        iconName: 'i-mdi-source-branch-sync',
        tags: ['开发中']
      },
      {
        name: '服务商',
        iconName: 'i-mdi-toolbox-outline',
        uri: 'provider'
      }
    ]
  },
  {
    name: '订单',
    uri: 'order',
    iconName: 'i-mdi-note-edit-outline',
    sub: [
      {
        name: '订单录入',
        uri: 'input',
        iconName: 'i-mdi-import',
        tags: ['开发中']
      },
      {
        name: '订单跟踪',
        uri: 'query',
        iconName: 'i-mdi-eye',
        tags: ['开发中']
      },
      {
        name: '外部订单导入',
        uri: 'import',
        iconName: 'i-mdi-microsoft-excel',
        tags: ['开发中']
      }
    ]
  },
  {
    name: '用户',
    uri: 'user',
    iconName: 'i-mdi-account-lock',
    sub: [
      {
        name: '用户信息管理',
        uri: 'infoAdmin',
        iconName: 'i-mdi-account-key',
        tags: ['开发中']
      }
    ]
  },
  {
    name: '渠道',
    uri: 'channel',
    iconName: 'i-mdi-store',
    sub: [
      {
        name: '渠道管理',
        tags: ['开发中'],
        iconName: 'i-mdi-store-check',
        uri: 'admin'
      }
    ]
  },
  {
    name: '服务商',
    uri: 'provider',
    requirePermissions: ['USER'],
    iconName: 'i-mdi-toolbox-outline',
    sub: [
      {
        name: '服务商管理',
        uri: 'admin',
        iconName: 'i-mdi-toolbox',
        tags: ['开发中']
      }
    ]
  },
  {
    name: '网点',
    requirePermissions: ['USER', 'POINTER'],
    iconName: 'i-mdi-access-point',
    uri: 'endpoint',
    sub: [
      {
        name: '网点管理',
        uri: 'admin',
        iconName: 'i-mdi-access-point-plus',
        tags: ['开发中']
      }
    ]
  },
  {
    name: '商品/服务',
    uri: 'goods',
    iconName: 'i-mdi-shopping',
    sub: [
      {
        name: '商品管理',
        uri: 'admin',
        iconName: 'i-mdi-printer',
        tags: ['开发中']
      },
      {
        name: '添加商品首页',
        uri: 'addGoods',
        requirePermissions: ['ADMIN'],
        hidden: true
      },
      {
        name: '商品添加',
        uri: 'addPhysical',
        requirePermissions: ['ADMIN'],
        iconName: 'i-mdi-store-plus',
        tags: ['开发中']
      },
      {
        name: '服务添加',
        uri: 'addService',
        iconName: 'i-mdi-toolbox',
        tags: ['开发中']
      },
      {
        name: '商品单位',
        uri: 'unitDetails',
        iconName: 'i-mdi-storefront-remove-outline',
        tags: ['弃用']
      }
    ]
  },
  {
    name: '资源',
    uri: 'resources',
    iconName: 'i-mdi-semantic-web',
    sub: [
      {
        name: '类目/分类',
        uri: 'category',
        iconName: 'i-mdi-shape',
        tags: ['RC']
      },
      {
        name: '品牌',
        iconName: 'i-mdi-tag-arrow-right',
        uri: 'brand',
        tags: ['RC']
      },
      {
        name: '附件/图片',
        iconName: 'i-mdi-nas',
        uri: 'attachment',
        tags: ['开发中']
      }
    ]
  },
  {
    name: '营销',
    uri: 'marketing',
    iconName: 'i-mdi-ticket-percent-outline',
    sub: [
      {
        name: '优惠券',
        uri: 'coupons',
        iconName: 'i-mdi-ticket-percent',
        sub: [
          {
            name: '优惠券配置',
            uri: 'config',
            tags: ['开发中']
          },
          {
            name: '礼券/卡',
            uri: 'physical',
            tags: ['开发中']
          }
        ]
      },
      {
        name: '首页推送',
        uri: 'swiper',
        iconName: 'i-mdi-gesture-swipe',
        tags: ['开发中']
      },
      {
        name: 'VIP',
        uri: 'vip',
        sub: [
          {
            name: '基础配置',
            uri: 'config',
            tags: ['开发中']
          },
          {
            name: '奖励/勋章',
            uri: 'reward',
            tags: ['开发中']
          }
        ]
      },
      {
        name: '储值',
        uri: 'recharge',
        iconName: 'i-mdi-cash-100',
        tags: ['开发中']
      },
      {
        name: '积分',
        uri: 'points',
        tags: ['开发中']
      }
    ]
  },
  {
    name: '分销',
    uri: 'distribution',
    iconName: 'i-mdi-source-branch-sync',
    sub: [
      {
        name: '分销跟踪',
        uri: 'query',
        iconName: 'i-mdi-eye-check-outline',
        tags: ['开发中']
      },
      {
        name: '个人分销配置',
        iconName: 'i-mdi-account-outline',
        uri: 'userConfig',
        tags: ['开发中']
      },
      {
        name: '分销组配置',
        iconName: 'i-mdi-calendar-multiple-check',
        uri: 'groupConfig',
        tags: ['开发中']
      },
      {
        name: '分销组管理',
        iconName: 'i-mdi-account-multiple-check-outline',
        uri: 'employeeAdmin',
        tags: ['开发中']
      }
    ]
  },
  {
    name: '系统配置',
    uri: 'system',
    requirePermissions: ['ROOT'],
    iconName: 'i-mdi-server-security',
    sub: [
      {
        name: '通用配置',
        iconName: 'i-mdi-hammer-wrench',
        uri: 'uniConfig',
        tags: ['开发中']
      },
      {
        name: '支付配置',
        uri: 'paymentConfig',
        iconName: 'i-mdi-credit-card-settings-outline',
        tags: ['开发中']
      }
    ]
  },
  {
    name: '向开发反馈',
    uri: 'feedback',
    iconName: 'i-mdi-comment-quote',
    tags: ['开发中']
  }
]

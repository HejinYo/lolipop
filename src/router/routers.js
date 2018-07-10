import Main from '@/view/main'
import parentView from '@/components/parent-view'

export default [
  {
    path: '/login',
    name: 'login',
    meta: {
      title: 'Login - 登录',
      hideInMenu: true
    },
    component: () => import('@/view/login/login.vue')
  },
  {
    path: '/',
    name: 'main',
    redirect: '/home',
    component: Main,
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: 'home',
        name: 'home',
        meta: {
          title: '首页',
          hideInMenu: true,
          notCache: true
        },
        component: () => import('@/view/home')
      },
      {
        path: 'ownspace',
        name: 'ownspace',
        meta: {
          title: '个人中心'
        },
        component: () => import('@/view/own-space/own-space')
      },
      {
        path: 'message',
        name: 'message',
        meta: {
          title: '消息中心'
        },
        component: () => import('@/view/message/message')
      }
    ]
  },
  {
    path: '',
    name: 'doc',
    meta: {
      title: '文档',
      href: 'https://lison16.github.io/iview-admin-doc/#/',
      icon: 'ios-book'
    }
  },
  {
    path: '/system',
    name: 'system',
    meta: {
      icon: 'ios-cog',
      title: '系统管理'
    },
    component: Main,
    children: [
      {
        path: 'resource',
        name: 'resource',
        meta: {
          icon: 'briefcase',
          title: '资源管理',
          access: ['sys:resource:view']
        },
        component: () => import('@/view/system/resource')
      },
      {
        path: 'dept',
        name: 'dept',
        meta: {
          icon: 'compass',
          title: '部门管理',
          access: ['sys:dept:view']
        },
        component: () => import('@/view/system/dept')
      },
      {
        path: 'role',
        name: 'role',
        meta: {
          icon: 'ios-paw',
          title: '角色管理',
          access: ['sys:role:view']
        },
        component: () => import('@/view/system/role')
      },
      {
        path: 'user',
        name: 'user',
        meta: {
          icon: 'person-stalker',
          title: '用户管理',
          access: ['sys:user:view']
        },
        component: () => import('@/view/system/user')
      },
      {
        path: 'dict',
        name: 'dict',
        meta: {
          icon: 'cube',
          title: '数据字典'
        },
        component: () => import('@/view/system/dict')
      },
      {
        path: 'config',
        name: 'config',
        meta: {
          icon: 'aperture',
          title: '参数配置',
          requireAuth: true
        },
        component: () => import('@/view/system/config')
      },
      {
        path: 'log',
        name: 'log',
        meta: {
          icon: 'map',
          title: '日志管理',
          requireAuth: true
        },
        component: () => import('@/view/system/log')
      },
      {
        path: 'vuexTest',
        name: 'vuexTest',
        meta: {
          icon: 'person-stalker',
          title: '状态测试',
          requireAuth: true
        },
        component: () => import('@/view/test-page/tree-select-test.vue')
      }
    ]
  },
  {
    path: '/components',
    name: 'components',
    meta: {
      icon: 'social-buffer',
      title: '组件'
    },
    component: Main,
    children: [
      {
        path: 'split_pane_page',
        name: 'split_pane_page',
        meta: {
          icon: 'pause',
          title: '分割窗口'
        },
        component: () => import('@/view/components/split-pane/split-pane.vue')
      },
      {
        path: 'markdown_page',
        name: 'markdown_page',
        meta: {
          icon: 'social-markdown',
          title: 'Markdown编辑器'
        },
        component: () => import('@/view/components/markdown/markdown.vue')
      },
      {
        path: 'editor_page',
        name: 'editor_page',
        meta: {
          icon: 'compose',
          title: '富文本编辑器'
        },
        component: () => import('@/view/components/editor/editor.vue')
      },
      {
        path: 'icons_page',
        name: 'icons_page',
        meta: {
          icon: '_bear',
          title: '自定义图标'
        },
        component: () => import('@/view/components/icons/icons.vue')
      }
    ]
  },
  {
    path: '/multilevel',
    name: 'multilevel',
    meta: {
      icon: 'arrow-graph-up-right',
      title: '多级菜单'
    },
    component: Main,
    children: [
      {
        path: 'level_2_1',
        name: 'level_2_1',
        meta: {
          icon: 'arrow-graph-up-right',
          title: '二级-1'
        },
        component: () => import('@/view/multilevel/level-1.vue')
      },
      {
        path: 'level_2_2',
        name: 'level_2_2',
        meta: {
          access: ['super_admin'],
          icon: 'arrow-graph-up-right',
          title: '二级-2'
        },
        component: parentView,
        children: [
          {
            path: 'level_2_2_1',
            name: 'level_2_2_1',
            meta: {
              icon: 'arrow-graph-up-right',
              title: '三级-1'
            },
            component: () => import('@/view/multilevel/level-2/level-2-1.vue')
          },
          {
            path: 'level_2_2_2',
            name: 'level_2_2_2',
            meta: {
              icon: 'arrow-graph-up-right',
              title: '三级-2'
            },
            component: () => import('@/view/multilevel/level-2/level-2-1.vue')
          }
        ]
      },
      {
        path: 'level_2_3',
        name: 'level_2_3',
        meta: {
          icon: 'arrow-graph-up-right',
          title: '二级-3'
        },
        component: parentView,
        children: [
          {
            path: 'level_2_3_1',
            name: 'level_2_3_1',
            meta: {
              access: ['super_admin'],
              icon: 'arrow-graph-up-right',
              title: '三级-1'
            },
            component: () => import('@/view/multilevel/level-2/level-3/level-3-1.vue')
          },
          {
            path: 'level_2_3_2',
            name: 'level_2_3_2',
            meta: {
              access: ['super_admin', 'admin'],
              icon: 'arrow-graph-up-right',
              title: '三级-2'
            },
            component: () => import('@/view/multilevel/level-2/level-3/level-3-1.vue')
          }
        ]
      }
    ]
  },
  {
    path: '/401',
    name: 'error_401',
    component: () => import('@/view/error-page/401.vue')
  },
  {
    path: '/500',
    name: 'error_500',
    component: () => import('@/view/error-page/500.vue')
  },
  {
    path: '*',
    name: 'error_404',
    component: () => import('@/view/error-page/404.vue')
  }
]

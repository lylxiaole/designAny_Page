import { IRouteClass } from 'common/baseConfigs'
import adminLayout from '@common/layouts/adminLayout/index.vue'

const routes: IRouteClass[] = [
  {
    path: '/',
    redirect: '/designApplications',
    component: adminLayout,
    children: [
      {
        icon: 'icon-all-fill',
        path: '/designApplications',
        name: 'designApplications',
        meta: {
          title: '我的应用'
        },
        component: () => require('./views/designApplications/index.vue')
      },
      // {
      //   icon: 'icon-all-fill',
      //   path: '/designApis',
      //   name: 'designApis',
      //   meta: {
      //     title: '我的接口'
      //   },
      //   component: () => import('./views/designApis/index.vue')
      // },
      // {
      //   icon: 'icon-all-fill',
      //   path: '/designDatabases',
      //   name: 'designDatabases',
      //   meta: {
      //     title: '我的数据库'
      //   },
      //   component: () => import('./views/designDatabases/index.vue')
      // },

      {
        icon: 'icon-all-fill',
        path: '/designThirtyApis',
        name: 'designThirtyApis',
        meta: {
          title: '外部接口'
        },
        component: () => require('./views/designThirtyApis/index.vue')
      },
      {
        icon: 'icon-all-fill',
        path: '/designDictionary',
        name: 'designDictionary',
        meta: {
          title: '字典管理'
        },
        component: () => require('./views/designDictionary/index.vue')
      },
      {
        icon: 'icon-all-fill',
        path: '/designFunctions',
        name: 'designFunctions',
        meta: {
          title: 'JS函数'
        },
        component: () => require('./views/designFunctions/index.vue')
      }
    ]
  },
  {
    icon: 'icon-all-fill',
    path: '/designPages',
    name: 'designPages',
    hidden: true,
    meta: {
      title: '应用设计'
    },
    component: () => require('./views/designPages/index.vue')
  },
  {
    icon: 'icon-all-fill',
    path: '/viewPages',
    name: 'viewPages',
    hidden: true,
    meta: {
      title: '应用预览'
    },
    component: () => require('./views/previewPages/index.vue')
  },
  {
    path: '/login',
    name: 'login',
    hidden: true,
    meta: {
      title: '登录'
    },
    component: () => require('./views/user/login.vue')
  },
  {
    path: '/register',
    name: 'register',
    hidden: true,
    meta: {
      title: '注册'
    },
    component: () => require('./views/user/register.vue')
  }
]

export default routes

import { IRouteClass } from '@src/baseConfigs'
import adminLayout from '@src/layouts/adminLayout/index.vue'

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
        component: () => import(/* webpackChunkName: "designApplications" */ './views/designApplications/index.vue')
      },

      {
        icon: 'icon-all-fill',
        path: '/designApis',
        name: 'designApis',
        meta: {
          title: '我的接口'
        },
        component: () => import(/* webpackChunkName: "designApis" */ './views/designApis/index.vue')
      },
      {
        icon: 'icon-all-fill',
        path: '/designDatabases',
        name: 'designDatabases',
        meta: {
          title: '我的数据库'
        },
        component: () => import(/* webpackChunkName: "designDatabases" */ './views/designDatabases/index.vue')
      }
    ]
  },
  {
    icon: 'icon-all-fill',
    path: '/designPages',
    name: 'designPages',
    hidden: true,
    meta: {
      title: '我的页面'
    },
    component: () => import(/* webpackChunkName: "designPages" */ './views/designPages/index.vue')
  },
  {
    path: '/login',
    name: 'login',
    hidden: true,
    meta: {
      title: '登录'
    },
    component: () => import(/* webpackChunkName: "user" */ './views/user/login.vue')
  },
  {
    path: '/register',
    name: 'register',
    hidden: true,
    meta: {
      title: '注册'
    },
    component: () => import(/* webpackChunkName: "user" */ './views/user/register.vue')
  }
]

export default routes

import { IRouteClass } from 'common/baseConfigs'
import adminLayout from '@common/layouts/adminLayout/index.vue'
import { getLocale } from '@common/baseConfigs'

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
          title: getLocale().t('menu.myApps')
        },
        component: async () => require('./views/designApplications/index.vue')
      },
      // {
      //   icon: 'icon-all-fill',
      //   path: '/designApis',
      //   name: 'designApis',
      //   meta: {
      //     title: '我的接口'
      //   },
      //   component: async () => import('./views/designApis/index.vue')
      // },
      // {
      //   icon: 'icon-all-fill',
      //   path: '/designDatabases',
      //   name: 'designDatabases',
      //   meta: {
      //     title: '我的数据库'
      //   },
      //   component: async () => import('./views/designDatabases/index.vue')
      // },
      {
        icon: 'icon-all-fill',
        path: '/designThirtyApis',
        name: 'designThirtyApis',
        meta: {
          title: getLocale().t('menu.HttpApi')
        },
        component: async () => require('./views/designThirtyApis/index.vue')
      },
      {
        icon: 'icon-all-fill',
        path: '/designDictionary',
        name: 'designDictionary',
        meta: {
          title: getLocale().t('menu.Dictionarys')
        },
        component: async () => require('./views/designDictionary/index.vue')
      },
      {
        icon: 'icon-all-fill',
        path: '/designFunctions',
        name: 'designFunctions',
        meta: {
          title: getLocale().t('menu.JSFuncs')
        },
        component: async () => require('./views/designFunctions/index.vue')
      }
    ]
  },
  {
    icon: 'icon-all-fill',
    path: '/designPages',
    name: 'designPages',
    hidden: true,
    meta: {
      title: 'APP Design'
    },
    component: async () => require('./views/designPages/index.vue')
  },
  {
    icon: 'icon-all-fill',
    path: '/viewPages',
    name: 'viewPages',
    hidden: true,
    meta: {
      title: 'APP View'
    },
    component: async () => require('./views/viewPage/index.vue')
  },
  {
    path: '/login',
    name: 'login',
    hidden: true,
    meta: {
      title: 'Sign In'
    },
    component: async () => require('./views/user/login.vue')
  },
  {
    path: '/register',
    name: 'register',
    hidden: true,
    meta: {
      title: 'Sign Up'
    },
    component: async () => require('./views/user/register.vue')
  }
]

export default routes

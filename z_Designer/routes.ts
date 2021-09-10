import { IRouteClass } from '@src/baseConfigs'
import adminLayout from '@src/layouts/adminLayout/index.vue'

const routes: IRouteClass[] = [
  {
    path: '/',
    redirect: '/index',
    component: adminLayout,
    children: [
      {
        icon: 'icon-all-fill',
        path: '/index',
        name: 'index',
        meta: {
          title: '我的应用'
        },
        component: () => import(/* webpackChunkName: "HelloWorld" */ './views/HelloWorld.vue')
      },
      {
        icon: 'icon-all-fill',
        path: '/second',
        name: 'second',
        meta: {
          title: '资源管理'
        },
        component: () => import(/* webpackChunkName: "HelloWorld" */ '@src/views/vmain.vue')
      },
      ,
      {
        icon: 'icon-all-fill',
        path: '/third',
        name: 'third',
        meta: {
          title: '使用教程'
        },
        component: () => import(/* webpackChunkName: "HelloWorld" */ '@src/views/vmain.vue')
      },
      {
        icon: 'icon-all-fill',
        path: '/fourth',
        name: 'fourth',
        meta: {
          title: '社区'
        },
        component: () => import(/* webpackChunkName: "HelloWorld" */ '@src/views/vmain.vue')
      }
    ]
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

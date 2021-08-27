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
          title: '系统首页'
        },
        component: () => import('./views/HelloWorld.vue')
      },
      {
        icon: 'icon-all-fill',
        path: '/second',
        name: 'second',
        meta: {
          title: '系统二页'
        },
        component: () => import('@src/views/vmain.vue')
      }
    ]
  }
]

export default routes

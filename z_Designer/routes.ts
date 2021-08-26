import { IRouteClass } from '@src/baseConfigs'
import adminLayout from '@src/layouts/adminLayout/index.vue'

const routes: IRouteClass[] = [
  {
    path: '/',
    redirect: '/index'
  },
  {
    name: 'home',
    path: '/',
    component: adminLayout,
    children: [
      {
        icon: '',
        path: '/index',
        name: 'index',
        meta: {
          title: '系统首页'
        },
        component: () => import('./views/HelloWorld.vue'),
        children: []
      }
    ]
  }
]

export default routes

import { IRouteClass } from '@src/baseConfigs'
import adminLayout from '@src/layouts/adminLayout/index.vue'

const routes: IRouteClass[] = [
  {
    path: '/',
    redirect: '/home/index'
  },
  {
    name: 'home',
    path: '/home',
    component: adminLayout,
    children: [
      {
        icon: '',
        path: '/home/index',
        name: 'index',
        meta: {
          title: '系统首页'
        },
        component: () => import(/* webpackChunkName: "HelloWorld" */ './views/HelloWorld.vue'),
        children: []
      }
    ]
  }
]

export default routes

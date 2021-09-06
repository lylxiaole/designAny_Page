import { IRouteClass } from '@src/baseConfigs'
import appLayout from '@src/layouts/appLayout/index.vue'

const routes: IRouteClass[] = [
  {
    path: '/',
    redirect: '/index',
    component: appLayout,
    children: [
      {
        icon: 'icon-all-fill',
        path: '/index',
        name: 'index',
        meta: {
          title: '我的应用'
        },
        component: () => import(/* webpackChunkName: "HelloWorld" */ './views/mainPage/index.vue')
      }
    ]
  }
]

export default routes

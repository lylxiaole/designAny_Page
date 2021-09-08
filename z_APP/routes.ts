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
        component: () => import('./views/mainPage/index.vue')
      },
      {
        icon: 'icon-all-fill',
        path: '/flowmeterDetail',
        name: 'flowmeterDetail',
        meta: {
          title: '我的应用'
        },
        component: () => import('./views/mainPage/flowmeter/flowmeterDetail.vue')
      },
      {
        icon: 'icon-all-fill',
        path: '/flowmeterDetailChart',
        name: 'flowmeterDetailChart',
        meta: {
          title: '我的应用'
        },
        component: () => import('./views/mainPage/flowmeter/detailChart.vue')
      }
    ]
  }
]

export default routes

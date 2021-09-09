import { IRouteClass } from '@src/baseConfigs'
import appLayout from '@src/layouts/appLayout/index.vue'
import mainPageLayout from './views/mainPage/index.vue'

const routes: IRouteClass[] = [
  {
    path: '/',
    redirect: '/index',
    component: appLayout,
    children: []
  },
  {
    icon: 'icon-all-fill',
    path: '/index',
    redirect: '/index/firstPage',
    component: mainPageLayout,
    children: [
      {
        icon: 'icon-all-fill',
        path: '/index/firstPage',
        name: 'firstPage',
        component: () => import('./views/mainPage/firstPage/index.vue')
      },
      {
        icon: 'icon-all-fill',
        path: '/index/flowmeter',
        name: 'flowmeter',
        component: () => import('./views/mainPage/flowmeter/index.vue')
      },
      {
        icon: 'icon-all-fill',
        path: '/index/position',
        name: 'position',
        component: () => import('./views/mainPage/position/index.vue')
      },
      {
        icon: 'icon-all-fill',
        path: '/index/equipmentAccount',
        name: 'equipmentAccount',
        component: () => import('./views/mainPage/equipmentAccount/index.vue')
      },
      {
        icon: 'icon-all-fill',
        path: '/index/alarmInformation',
        name: 'alarmInformation',
        component: () => import('./views/mainPage/alarmInformation/index.vue')
      },
      {
        icon: 'icon-all-fill',
        path: '/index/flowmeterDetail',
        name: 'flowmeterDetail',
        meta: {
          title: '我的应用'
        },
        component: () => import('./views/mainPage/flowmeter/flowmeterDetail.vue')
      },
      {
        icon: 'icon-all-fill',
        path: '/index/flowmeterDetailChart',
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

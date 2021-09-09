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
        component: () => import('./views/mainPage/index.vue'),
        children: [
          {
            icon: 'icon-all-fill',
            path: '/firstPage',
            name: 'firstPage',
            component: () => import('./views/mainPage/firstPage/index.vue')
          },
          {
            icon: 'icon-all-fill',
            path: '/flowmeter',
            name: 'flowmeter',
            component: () => import('./views/mainPage/flowmeter/index.vue')
          },
          {
            icon: 'icon-all-fill',
            path: '/position',
            name: 'position',
            component: () => import('./views/mainPage/position/index.vue')
          },
          {
            icon: 'icon-all-fill',
            path: '/equipmentAccount',
            name: 'equipmentAccount',
            component: () => import('./views/mainPage/equipmentAccount/index.vue')
          },
          {
            icon: 'icon-all-fill',
            path: '/alarmInformation',
            name: 'alarmInformation',
            component: () => import('./views/mainPage/alarmInformation/index.vue')
          }
        ]
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

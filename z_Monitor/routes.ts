import { IRouteClass } from '@src/baseConfigs'
import blankLayout from '@src/layouts/blankLayout/index.vue'

const routes: IRouteClass[] = [
  {
    path: '/',
    redirect: '/flowmeterAlarm',
    component: blankLayout,
    children: [
      {
        icon: 'icon-all-fill',
        name: 'flowmeterAlarm',
        path: '/flowmeterAlarm',
        component: () => import('./views/monitor/flowmeterAlarm/index.vue')
      },
      {
        icon: 'icon-all-fill',
        name: 'flowmeterArea',
        path: '/flowmeterArea',
        component: () => import('./views/monitor/flowmeterArea/index.vue')
      },
      {
        icon: 'icon-all-fill',
        name: 'flowmeterCompare',
        path: '/flowmeterCompare',
        component: () => import('./views/monitor/flowmeterCompare/index.vue')
      },
      {
        icon: 'icon-all-fill',
        name: 'flowmeterFlow',
        path: '/flowmeterFlow',
        component: () => import('./views/monitor/flowmeterFlow/index.vue')
      },
      {
        icon: 'icon-all-fill',
        name: 'flowmeterInfo',
        path: '/flowmeterInfo',
        component: () => import('./views/monitor/flowmeterInfo/index.vue')
      },
      {
        icon: 'icon-all-fill',
        name: 'historyData',
        path: '/historyData',
        component: () => import('./views/monitor/historyData/index.vue')
      },
      {
        icon: 'icon-all-fill',
        name: 'mapView',
        path: '/mapView',
        component: () => import('./views/monitor/mapView/index.vue')
      }
    ]
  }
]

export default routes

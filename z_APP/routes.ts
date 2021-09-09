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
        meta: {
          title: '首页',
          needFooter: true
        },
        component: () => import(/* webpackChunkName: "firstPage" */ './views/mainPage/firstPage/index.vue')
      },
      {
        icon: 'icon-all-fill',
        path: '/index/flowmeter',
        name: 'flowmeter',
        meta: {
          title: '流量计',
          needFooter: true
        },
        component: () => import(/* webpackChunkName: "flowmeter" */ './views/mainPage/flowmeter/index.vue')
      },
      {
        icon: 'icon-all-fill',
        path: '/index/position',
        name: 'position',
        meta: {
          title: '位置',
          needFooter: true
        },
        component: () => import(/* webpackChunkName: "position" */ './views/mainPage/position/index.vue')
      },
      {
        icon: 'icon-all-fill',
        path: '/index/equipmentAccount',
        name: 'equipmentAccount',
        meta: {
          title: '设备台账',
          needFooter: true
        },
        component: () => import(/* webpackChunkName: "equipmentAccount" */ './views/mainPage/equipmentAccount/index.vue')
      },
      {
        icon: 'icon-all-fill',
        path: '/index/alarmInformation',
        name: 'alarmInformation',
        meta: {
          title: '报警信息',
          needFooter: true
        },
        component: () => import(/* webpackChunkName: "alarmInformation" */ './views/mainPage/alarmInformation/index.vue')
      },
      {
        icon: 'icon-all-fill',
        path: '/index/flowmeterDetail',
        name: 'flowmeterDetail',
        meta: {
          title: '流量计详情',
          needFooter: false,
          needNavBack: true
        },
        component: () => import(/* webpackChunkName: "flowmeterDetail" */ './views/mainPage/flowmeter/flowmeterDetail.vue')
      },
      {
        icon: 'icon-all-fill',
        path: '/index/flowmeterDetailChart',
        name: 'flowmeterDetailChart',
        meta: {
          title: '流量计详情-chart图',
          needFooter: false,
          needNavBack: true
        },
        component: () => import(/* webpackChunkName: "flowmeterDetailChart" */ './views/mainPage/flowmeter/detailChart.vue')
      }
    ]
  }
]

export default routes

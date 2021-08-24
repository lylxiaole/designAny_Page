import { IRouteClass } from '@src/baseConfigs'
const routes: IRouteClass[] = [
  {
    title: '主页',
    icon: '',
    hidden: true,
    path: '',
    component: require('@src/layouts/SingleLayout').default,
    children: [
      {
        title: '生产班报表',
        icon: '',
        hidden: true,
        path: '/shiftReport',
        component: require('@/views/ShiftReport/index').default
      },
      {
        title: '检验日报表',
        icon: '',
        hidden: true,
        path: '/checkDayReport',
        component: require('@/views/CheckDayReport/index').default
      },
      {
        title: '对外检验日报表',
        icon: '',
        hidden: true,
        path: '/external_CheckDayReport',
        component: require('@/views/External_CheckDayReport/index').default
      },
      {
        title: '制造分厂日报',
        icon: '',
        hidden: true,
        path: '/manufacturingReport',
        component: require('@/views/ManufacturingReport/index').default
      },
      {
        title: '外观检验明细月报表',
        icon: '',
        hidden: true,
        path: '/viewingTestMonth',
        component: require('@/views/ViewingTestMonth/index').default
      }
    ]
  }
]

export default routes

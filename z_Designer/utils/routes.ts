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
      }
    ]
  }
]

export default routes

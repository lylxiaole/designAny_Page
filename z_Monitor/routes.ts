import { IRouteClass } from '@src/baseConfigs'
import blankLayout from '@src/layouts/blankLayout/index.vue'
import mainPageLayout from './views/mainPage/index.vue'

const routes: IRouteClass[] = [
  {
    path: '/',
    redirect: '/index',
    component: blankLayout,
    children: [
      {
        icon: 'icon-all-fill',
        name: 'flowmeterDetailChart',
        path: '/index',
        component: () => import('./views/mainPage/firstPage/index.vue')
      }
    ]
  }
]

export default routes

import { IRouteClass } from '@src/baseConfigs'
const routes: IRouteClass[] = [
  {
    title: '主页',
    icon: '',
    hidden: true,
    path: '',
    name: '',
    component: () => import('./views/HelloWorld.vue'),
    children: []
  }
]

export default routes

export let configs: any = {
  apiAddr: 'http://192.168.1.1:8080',
  LOGINED_USER_SESSION: 'LOGINED_USER_SESSION',
  uri_alarm: 'http://118.31.184.21:7800' // 告警系统测试接口
}

export const routes = [
  {
    title: '错误页',
    icon: '',
    hidden: true,
    path: '/error',
    component: () => import('@src/views/Error')
  }
]

export const appState = {
  username: '',
  compact: true, //是否是紧凑布局
  colorStyle: 'dark' //主题颜色
}

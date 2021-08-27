import Cookies from 'js-cookie'

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

export const systemAppStore = {
  namespaced: true,
  state: {
    tagsList: [],
    collapse: false,
    sidebar: {
      opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true,
      withoutAnimation: false
    },
    device: 'desktop',
    systemCount: 3,
    colorStyle: 'dark' //主题颜色
  },
  mutations: {
    addSystemCount(state, data) {
      state.systemCount += data
    },
    delTagsItem(state, data) {
      state.tagsList.splice(data.index, 1)
    },
    setTagsItem(state, data) {
      state.tagsList.push(data)
    },
    clearTags(state) {
      state.tagsList = []
    },
    closeTagsOther(state, data) {
      state.tagsList = data
    },
    closeCurrentTag(state, data) {
      for (let i = 0, len = state.tagsList.length; i < len; i++) {
        const item = state.tagsList[i]
        if (item.path === data.$route.fullPath) {
          if (i < len - 1) {
            data.$router.push(state.tagsList[i + 1].path)
          } else if (i > 0) {
            data.$router.push(state.tagsList[i - 1].path)
          } else {
            data.$router.push('/')
          }
          state.tagsList.splice(i, 1)
          break
        }
      }
    },
    // 侧边栏折叠
    handleCollapse(state, data) {
      state.collapse = data
    }
  },
  actions: {}
}

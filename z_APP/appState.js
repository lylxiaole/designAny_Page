const appState = {
  namespaced: true,
  state: {
    appCount: 0,
    bottomBarActive: 0
  },
  mutations: {
    addAppCount(state, data) {
      state.appCount += data
    },
    changeBottomBarActive(state, data) {
      state.bottomBarActive = data
    }
  },
  actions: {}
}

export default appState

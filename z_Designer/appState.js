const appState = {
  namespaced: true,
  state: {
    appCount: 0,
    machineId: null
  },
  mutations: {
    addAppCount(state, data) {
      state.appCount += data
    }
  },
  actions: {}
}

export default appState

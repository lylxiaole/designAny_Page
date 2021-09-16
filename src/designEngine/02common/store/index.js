import Vue from 'vue'
import Vuex from 'vuex'

import app from './modules/app'
// import user from './modules/user'
// import permission from './modules/permission'
// import flow from './modules/flow'
import getters from './getters'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    app,
    // flow,
  },
  state: { modelInfos: [], currentScaleSize_: 1 },
  mutations: {},
  actions: {},
  getters,
})

import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import { systemAppStore } from './baseInfo'
Vue.use(Vuex)

let localStore: Store<any> = null

export function initStore(instore: any): Store<any> {
  systemAppStore.mutations['setKeyValueMutation'] = setKeyValueMutation
  instore.mutations['setKeyValueMutation'] = setKeyValueMutation

  let modules = {}
  modules['system'] = systemAppStore
  modules['app'] = instore

  localStore = new Vuex.Store({ modules })
  return localStore
}

const setKeyValueMutation = (state, data) => {
  state[data.key] = data.value
}

export function getStore(): Store<any> {
  return localStore
}

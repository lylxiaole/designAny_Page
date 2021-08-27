import Vue from 'vue'
import Vuex, { Store } from 'vuex'
import { systemAppStore } from './baseInfo'
Vue.use(Vuex)

let localStore: Store<any> = null

export function initStore(instore: any): Store<any> {
  let modules = {}
  modules['system'] = systemAppStore
  modules['app'] = instore

  localStore = new Vuex.Store({ modules })
  return localStore
}

export function getStore(): Store<any> {
  return localStore
}

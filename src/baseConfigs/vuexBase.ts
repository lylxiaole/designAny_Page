import Vue from 'vue'
import Vuex from 'vuex'
import { systemAppStore } from './baseInfo'
Vue.use(Vuex)

let localStore: any = null

export function initStore(instore: any) {
  let modules = {}
  modules['system'] = systemAppStore
  modules['app'] = instore

  localStore = new Vuex.Store({ modules })
  return localStore
}

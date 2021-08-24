import { createStore, Store } from 'vuex'
import { systemAppStore } from './baseInfo'

let localStore: Store<any> = null

export function initStore(instore: any) {
  let modules = {}
  modules['system'] = systemAppStore
  modules['app'] = instore

  localStore = createStore({ modules })
  return localStore
}

import { createStore, Store } from 'redux'
import { systemAppStore } from './baseInfo'
export class IReduxAction {
  type: string
  payload: any
}

let localState: any = {} //当前全局状态记录
function baseReducer(state = localState, action: IReduxAction) {
  state[action.type] = action.payload
  return state
}

let localStore: Store = null
export function initStore(instate: any) {
  let clonestate = { ...systemAppStore } as any
  for (const key in instate) {
    clonestate[key] = instate[key] as any
  }
  localState = clonestate
  localStore = createStore(baseReducer)
}

export function getStore(): Store {
  return localStore
}

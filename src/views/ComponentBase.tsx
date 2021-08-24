import React from 'react'
import { createStore, Store } from 'redux'

import { getStore, IReduxAction } from '../baseConfigs'
export interface IState {
  appState: any
}
export default class ComponentBase<P = {}, IState = {}, SS = any> extends React.Component<P, IState, SS> {
  private unSubscribe: any
  private appStore: Store

  protected get appState(): any {
    if (!this.appStore) {
      return {}
    }
    return this.appStore.getState()
  }

  constructor(props: any) {
    super(props)

    this.appStore = getStore()
    this.unSubscribe = this.appStore.subscribe(() => {
      this.onAppStateChanged(this.appStore.getState())
    })
  }

  componentWillUnmount() {
    if (this.unSubscribe) {
      this.unSubscribe()
    }
  }

  protected async onAppStateChanged(state: any) {
    // this.setState({ appState: state } as any)
  }
  protected dispatch(configName: string, val: any) {
    let act: IReduxAction = {
      type: configName,
      payload: val
    }
    this.appStore.dispatch(act)
  }
}

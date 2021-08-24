import React from 'react'
import { BrowserRouter, Route, Link, withRouter, useHistory } from 'react-router-dom'
import PageBase from '@src/views/PageBase'
/**
 * 菜单数据预处理.
 * 加工从服务器端获得的menu数据,替换icon为Icon组件.添加权限等.
 * @param menus 本地菜单配置
 * @param userProfile 从服务器获取的权限数据.
 */

class SingleLayout extends PageBase<any, any> {
  constructor(props: any) {
    super(props)
    this.state = {}
  }

  componentDidMount() {}

  async onAppStateChanged(state: any) {
    window.console.log('SingleLayout:', state)
  }

  render() {
    return this.props.children
  }
}

export default withRouter(SingleLayout)

import React from 'react'
import ProLayout from '@ant-design/pro-layout'

import { Sortable } from 'devextreme-react/sortable'
import TabPanel from 'devextreme-react/tab-panel'
/**
 * 菜单数据预处理.
 * 加工从服务器端获得的menu数据,替换icon为Icon组件.添加权限等.
 * @param menus 本地菜单配置
 * @param userProfile 从服务器获取的权限数据.
 */

export default class Error extends React.Component<any, any> {
  private allMenus: any
  constructor(props: any) {
    super(props)
    this.state = {}
    this.allMenus = []
  }

  componentDidMount() {}

  render() {
    return <div>{'发生了错误'}</div>
  }
}

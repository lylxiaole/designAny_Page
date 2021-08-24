import React, { Children } from 'react'
import { BrowserRouter, Route, Link, withRouter, useHistory } from 'react-router-dom'
import PageBase from '@src/views/PageBase'
import PLayout, { MenuDataItem, PageContainer, ProBreadcrumb } from '@ant-design/pro-layout'
import { getRouteConfigs, IRouteClass } from '../../baseConfigs'
import styles from '../lay.module.less'
const logoIcon = require('../../assets/vSkySoftware-final_32.png').default
import LeftMenu from './LeftMenu'
import TopHeader from './TopHeader'

import { MenuFoldOutlined, MenuUnfoldOutlined, CrownOutlined } from '@ant-design/icons'
interface IState {
  compact: boolean
  colorStyle: 'light'
}
/**
 * 菜单数据预处理.
 * 加工从服务器端获得的menu数据,替换icon为Icon组件.添加权限等.
 * @param menus 本地菜单配置
 * @param userProfile 从服务器获取的权限数据.
 */
const loopMenuItem = (menus: IRouteClass[], parentRoutePath: string = undefined): MenuDataItem[] => {
  let res: MenuDataItem[] = []
  if (!menus) {
    return res
  }
  for (let index = 0; index < menus.length; index++) {
    const menu = menus[index]
    if (!menu.path) {
      res = res.concat(loopMenuItem(menu.children, ''))
      continue
    }

    let routepath = (parentRoutePath ? parentRoutePath : '') + menu.path
    window.console.log(routepath)
    res.push({
      hideInMenu: menu.hidden,
      icon: menu.icon ? menu.icon : <CrownOutlined />,
      name: menu.title,
      path: routepath,
      key: routepath,
      children: loopMenuItem(menu.children, routepath)
    })
  }
  return res
}
class ProLayout extends PageBase<any, IState> {
  private allMenus: MenuDataItem[] = []
  private leftMenuRef = React.createRef<any>()
  private topHeaderRef = React.createRef<any>()

  constructor(props: any) {
    super(props)
    this.state = {
      compact: this.appState.compact,
      colorStyle: this.appState.colorStyle
    }

    let allRoutes = getRouteConfigs()
    this.allMenus = loopMenuItem(allRoutes)
  }

  componentDidMount() {}
  async onAppStateChanged(state: any) {
    this.setState({ compact: state.compact })
  }

  getStyleByAppState() {
    let classn = []
    if (this.appState.compact) {
      classn.push(styles.prolayoutCompact)
    }

    switch (this.appState.colorStyle) {
      case 'dark':
        classn.push(styles.prolayoutDark)
        break
      case 'light':
        classn.push(styles.prolayoutLight)
        break
      default:
        break
    }
    return classn.join(' ')
  }

  setLeftMenuCollaspe = (val: boolean) => {
    this.leftMenuRef.current.setCollapsed(val)
    this.topHeaderRef.current.setCollapsed(val)
  }

  onTopHeader_CollapsedChanged = (val: boolean) => {
    this.leftMenuRef.current.setCollapsed(val)
  }

  // vSkySoftware-final_222_36.png
  render() {
    return (
      <PLayout
        navTheme="dark"
        primaryColor="#000000"
        className={this.getStyleByAppState()}
        logo={<img src={logoIcon} />}
        title="报表"
        location={{
          pathname: this.props.location.path
        }}
        menuRender={(props: any, defaultDom: any) => {
          return <LeftMenu ref={this.leftMenuRef} headerViewProps={props} defaultDom={defaultDom} />
        }}
        breadcrumbRender={(routers: any[]) => [...routers]}
        menuDataRender={() => this.allMenus}
        postMenuData={(menus) => menus}
        onCollapse={this.setLeftMenuCollaspe}
        headerContentRender={() => {
          return <TopHeader ref={this.topHeaderRef} onCollapsedChanged={this.onTopHeader_CollapsedChanged} />
        }}
      >
        <PageContainer
          header={{ title: null }}
          fixedHeader={true}
          tabProps={{
            type: 'editable-card',
            size: 'small',
            hideAdd: true,
            onEdit: (e, action) => console.log(e, action)
          }}
          tabList={[
            {
              tab: '基本信息',
              key: 'base'
            },
            {
              tab: '详细信息',
              key: 'info'
            }
          ]}
        >
          {this.props.children}
        </PageContainer>
      </PLayout>
    )
  }
}

export default withRouter(ProLayout)

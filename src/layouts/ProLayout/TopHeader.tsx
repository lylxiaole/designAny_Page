import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import { HeaderViewProps } from '@ant-design/pro-layout/lib/Header'
import styles from '../lay.module.less'
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, SettingFilled, LogoutOutlined } from '@ant-design/icons'
import { getStore, IReduxAction } from '@src/baseConfigs'
import { Avatar, Menu, Dropdown, Modal, Button, Space, Radio, Form } from 'antd'

import ComponentBase from '@src/views/ComponentBase'

interface IProp {
  onCollapsedChanged: (val: boolean) => void
}

const TopHeader = React.forwardRef((props: IProp, ref: any) => {
  // ********************状态钩子*****************************
  const [iscollapsed, localSetCollapsed] = useState(false)
  const [isModalVisible, setModalVisible] = useState(false)
  const [layoutCompact, setLayoutCompact] = useState(getStore().getState().compact)
  const [colorStyle, setColorStyle] = useState(getStore().getState().colorStyle)
  // ***********公布ref对外属性********************************************
  useImperativeHandle(ref, () => ({
    setCollapsed: (val: boolean) => {
      localSetCollapsed(val)
    }
  }))
  // **************事件********************************************************
  const onSetCollapsed = (val: boolean) => {
    localSetCollapsed(val)
    props.onCollapsedChanged(val)
  }
  const handleOk = () => {
    let act1: IReduxAction = {
      type: 'compact',
      payload: layoutCompact
    }
    getStore().dispatch(act1)

    let act2: IReduxAction = {
      type: 'colorStyle',
      payload: colorStyle
    }
    getStore().dispatch(act2)

    setModalVisible(false)
  }
  const handleCancel = () => {
    setModalVisible(false)
  }

  const handleMenuClick = (e: any) => {
    setModalVisible(true)
  }

  const onLayoutCompactChanged = (e: any) => {
    setLayoutCompact(e.target.value)
    // window.console.log('onLayoutTipeChanged:', e)
  }

  const onColorStyleChanged = (e: any) => {
    setColorStyle(e.target.value)
    // window.console.log('onColorStyleChanged:', e)
  }
  // ******************控件dom*********************************************************************
  let collaspeBtn = iscollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="0" icon={<SettingFilled />}>
        系统设置
      </Menu.Item>
      <Modal maskClosable={false} title="系统设置" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Form labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} layout="horizontal">
          <Form.Item label="布局">
            <Radio.Group onChange={onLayoutCompactChanged} value={layoutCompact}>
              <Radio value={true}>紧凑</Radio>
              <Radio value={false}>宽松</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="色系">
            <Radio.Group onChange={onColorStyleChanged} value={colorStyle}>
              <Radio value="dark">暗色</Radio>
              <Radio value="light">明亮色</Radio>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Modal>
      <Menu.Item key="1" icon={<LogoutOutlined />} danger>
        退出
      </Menu.Item>
    </Menu>
  )
  // ***************************************************************************************
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', display: 'block' }}>
      <div style={{ width: '36px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', float: 'left' }} onClick={() => onSetCollapsed(!iscollapsed)}>
        {collaspeBtn}
      </div>

      <div style={{ height: '100%', float: 'right', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Dropdown overlay={menu}>
          <Avatar shape="square" size="small" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </div>
  )
})

export default TopHeader

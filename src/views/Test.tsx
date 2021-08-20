import DataGrid, { Column, Grouping, GroupPanel, Pager, Paging, SearchPanel, ColumnChooser } from 'devextreme-react/data-grid'
import PageBase from '@src/views/PageBase'
import React from 'react'
import Form, { ButtonItem, Item, GroupItem } from 'devextreme-react/form'

export default class Test extends PageBase<any, any> {
  constructor(props: any) {
    super(props)
  }

  render() {
    return <div style={{ height: '100%', width: '100%', overflow: 'auto' }}>测试成功</div>
  }
  componentDidMount() {}
}

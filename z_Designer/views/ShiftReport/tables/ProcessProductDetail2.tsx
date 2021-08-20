import React from 'react'
import { Table } from 'antd'
import styles from '../index.module.less'

import {
  IGridProductDetail,
  IJiangliaoUseDetail,
  toTableData_GridProductDetail,
  toTableData_GridProductDetail1,
  toTableData_GridProductDetail2,
  toTableData_JiangliaoUseDetail,
  toTableData_JiangliaoWangbanSaved
} from '../dataAdapter'
const ProcessProductDetail2 = React.forwardRef((props: any, ref: any) => {
  let newdata = toTableData_GridProductDetail2(props.serverData)

  const onCellRender = (value: any, row: any, rowindex: number, columnDataField: string) => {
    const obj: any = {
      children: value,
      props: {
        rowSpan: 1,
        colSpan: 1
      }
    }
    if (row['process'] === '总消耗') {
      if (columnDataField === 'fragmentqty' || columnDataField === 'fragmentrate') {
        obj.props.colSpan = 0
      }
    }
    return obj
  }
  const columnsJson: any[] = [
    {
      title: '各工序产出情况',
      align: 'left',
      children: [
        {
          title: '工序',
          dataIndex: 'process',
          key: 'process',
          align: 'center',
          render: (value: any, row: any, rowindex: number) => {
            return onCellRender(value, row, rowindex, 'process')
          }
        },
        {
          title: '产能',
          dataIndex: 'curqty',
          key: 'curqty',
          align: 'center',
          render: (value: any, row: any, rowindex: number) => {
            return onCellRender(value, row, rowindex, 'curqty')
          }
        },
        {
          title: '碎片',
          dataIndex: 'fragmentqty',
          key: 'fragmentqty',
          align: 'center',
          render: (value: any, row: any, rowindex: number) => {
            return onCellRender(value, row, rowindex, 'fragmentqty')
          }
        },
        {
          title: '碎片率',
          dataIndex: 'fragmentrate',
          key: 'fragmentrate',
          align: 'center',
          render: (value: any, row: any, rowindex: number) => {
            return onCellRender(value, row, rowindex, 'fragmentrate')
          }
        }
      ]
    }
  ]

  const onHeaderRow = (columns: any, index: number) => {
    // window.console.log('onHeaderRow:', columns)
    if (columns.length == 1) {
      return {
        style: {
          height: '46px'
        }
      }
    } else {
      return {
        style: {
          height: '92px'
        }
      }
    }
  }

  return (
    <div ref={ref}>
      <Table
        onHeaderRow={onHeaderRow}
        className={styles.paddingStyle}
        columns={columnsJson}
        dataSource={newdata}
        bordered
        size="middle"
        pagination={false}
      />
    </div>
  )
})

export default ProcessProductDetail2

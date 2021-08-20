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

const ProcessProductDetail1 = React.forwardRef((props: any, ref: any) => {
  let newdata = toTableData_GridProductDetail1(props.serverData)
  const columnsJson: any[] = [
    {
      title: '各工序产出明细',
      align: 'left',
      children: [
        {
          title: '工序',
          dataIndex: 'process',
          key: 'process',
          align: 'center'
        },
        {
          title: '产能',
          dataIndex: 'curqty',
          key: 'curqty',
          align: 'center'
        },
        {
          title: '返工',
          dataIndex: 'returnqty',
          key: 'returnqty',
          align: 'center'
        },
        {
          title: '碎片',
          dataIndex: 'fragmentqty',
          key: 'fragmentqty',
          align: 'center'
        },
        {
          title: '报废',
          dataIndex: 'srcapqty',
          key: 'srcapqty',
          align: 'center'
        },
        {
          title: '结存',
          dataIndex: 'curtotalqty',
          key: 'curtotalqty',
          align: 'center'
        }
      ]
    }
  ]

  return (
    <div ref={ref}>
      <Table className={styles.paddingStyle} columns={columnsJson} dataSource={newdata} bordered size="middle" pagination={false} />
    </div>
  )
})

export default ProcessProductDetail1

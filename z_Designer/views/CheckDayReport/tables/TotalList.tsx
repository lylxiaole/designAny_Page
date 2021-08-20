import React from 'react'
import { Table } from 'antd'
import styles from '../index.scss'

import {
  IGridProductDetail,
  IJiangliaoUseDetail,
  toTableData_GridProductDetail,
  toTableData_GridProductDetail1,
  toTableData_GridProductDetail2,
  toTableData_JiangliaoUseDetail,
  toTableData_JiangliaoWangbanSaved
} from '../dataAdapter'

const TotalList = React.forwardRef((props: any, ref: any) => {

  let newdata = props.serverData
  const columnsJson: any[] = [
    {
      title: '数据汇总',
      align: 'left',
      children: [
        {
          title: '项目',
          align: 'center',
          dataIndex: 'item',
          key: 'item',
        },
        {
          title: 'G1单晶',
          align: 'center',
          children: [
            {
              title: 'A',
              dataIndex: 'a',
              key: 'a',
              align: 'center'
            },
            {
              title: 'A-',
              dataIndex: 'aSub',
              key: 'aSub',
              align: 'center'
            },
            {
              title: 'C',
              dataIndex: 'c',
              key: 'c',
              align: 'center'
            },
            {
              title: '合格比例',
              dataIndex: 'qualifiedRate',
              key: 'qualifiedRate',
              align: 'center'
            }
          ]
        },
      ]
    }
  ]

  return (
    <div ref={ref}>
      <Table className={styles.paddingStyle} columns={columnsJson} dataSource={newdata} bordered size="middle" pagination={false} />
    </div>
  )
})

export default TotalList

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

const JiangliaoWangbanSaved = React.forwardRef((props: any, ref: any) => {
  let newdata = toTableData_JiangliaoWangbanSaved(props.serverData)
  const columnsJson: any[] = [
    {
      title: '浆料，网板结存',
      align: 'left',
      children: [
        {
          title: '工序',
          dataIndex: 'workcellName2',
          key: 'workcellName2',
          align: 'center'
        },
        {
          title: '正常网版结存',
          dataIndex: 'nomalsegment',
          key: 'nomalsegment',
          align: 'center'
        },
        {
          title: '研发网版结存',
          dataIndex: 'yfsegment',
          key: 'yfsegment',
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

export default JiangliaoWangbanSaved

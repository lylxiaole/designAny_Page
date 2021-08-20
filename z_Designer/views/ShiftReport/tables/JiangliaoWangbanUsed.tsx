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
  toTableData_JiangliaoWangbanSaved,
  toTableData_JiangliaoWangbanUsed
} from '../dataAdapter'

const JiangliaoWangbanUsed = React.forwardRef((props: any, ref: any) => {
  let newdata = toTableData_JiangliaoWangbanUsed(props.serverData)
  const columnsJson: any[] = [
    {
      title: '浆料，网板实际消耗',
      align: 'left',
      children: [
        {
          title: '工序',
          dataIndex: 'workcellName',
          key: 'workcellName',
          align: 'center'
        },
        {
          title: '单耗指标',
          dataIndex: 'target',
          key: 'target',
          align: 'center'
        },
        {
          title: '实际消耗kg',
          align: 'center', 
          children: [
            {
              title: '正常浆料',
              dataIndex: 'consumptionzc',
              key: 'consumptionyf',
              align: 'center'
            },
            {
              title: '研发浆料',
              dataIndex: 'consumptionyf',
              key: 'consumptionyf',
              align: 'center'
            } ,
            {
              title: '合计',
              dataIndex: 'consumption',
              key: 'consumption',
              align: 'center'
            } 
          ]
        },
        {
          title: '实际单耗',
          dataIndex: 'consumptionunit',
          key: 'consumptionunit',
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

export default JiangliaoWangbanUsed

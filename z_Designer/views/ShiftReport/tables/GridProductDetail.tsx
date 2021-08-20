import React from 'react'
import { Table } from 'antd'
import styles from '../index.module.less'
import { detailTabledata } from '../testData'

import { IGridProductDetail, IJiangliaoUseDetail, toTableData_GridProductDetail, toTableData_GridProductDetail1, toTableData_GridProductDetail2, toTableData_JiangliaoUseDetail, toTableData_JiangliaoWangbanSaved } from '../dataAdapter'

const GridProductDetail = React.forwardRef((props: any, ref: any) => {
  let serverdata = props.serverData
  // if (process.env.NODE_ENV === 'development') {
  //   serverdata = detailTabledata
  // }

  let newdata = toTableData_GridProductDetail(serverdata)

  const onCellRender = (value: any, row: any, rowindex: number, columnDataField: string) => {
    const obj: any = {
      children: value,
      props: {
        rowSpan: 1,
        colSpan: 1
      }
    }
    // window.console.log('onCellRender columnDataField:', columnDataField)
    // ***************计算行合并************************************
    if (columnDataField === 'process' || columnDataField === 'remark') {
      //计算原始数据里的行数组
      let rowspanArr = []
      for (let index = 0; index < newdata.length; index++) {
        const element = newdata[index]
        if (element['process'] === row['process']) {
          rowspanArr.push(index)
        }
      }
      // window.console.log('onCellRender:' + columnDataField, rowspanArr)
      //
      if (rowspanArr.length > 1 && rowindex === rowspanArr[0]) {
        obj.props.rowSpan = rowspanArr.length
      } else if (rowspanArr.length > 1 && rowindex !== rowspanArr[0]) {
        obj.props.rowSpan = 0
      }
    }

    if (columnDataField === 'line' || columnDataField === 'fragmentrate') {
      // window.console.log('columnDataField:',row[columnDataField])
      let rowspanArr = []
      for (let index = 0; index < newdata.length; index++) {
        const rowdata = newdata[index]
        if (rowdata['line'] === row['line'] && row['process'] === rowdata['process']) {
          rowspanArr.push(index)
        }
      }

      if (rowspanArr.length > 1 && rowindex === rowspanArr[0]) {
        obj.props.rowSpan = rowspanArr.length
      } else if (rowspanArr.length > 1 && rowindex !== rowspanArr[0]) {
        obj.props.rowSpan = 0
      }
    }
    // ***************计算列合并************************************
    if (row['process'] === '合计' && row['line'] === '合计' && row['batchNo'] === '合计') {
      if (columnDataField === 'process') {
        obj.props.colSpan = 3
      } else if (columnDataField === 'line' || columnDataField === 'batchNo') {
        obj.props.colSpan = 0
      }
    }

    if (row['batchNo'] === '合计1xxx') {
      let keys = Object.keys(row)
      // window.console.log('columnDataField:', columnDataField)
      if (columnDataField === 'process') {
        obj.props.colSpan = 8
        obj.children = ''
      } else if (columnDataField === 'fragmentrate') {
        obj.props.colSpan = 1
      } else if (columnDataField === 'remark') {
        obj.props.colSpan = 3
      } else {
        obj.props.colSpan = 0
      }
    }

    return obj
  }

  const columnsJson: any[] = [
    {
      title: '各工序产出明细',
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
          title: '线别',
          dataIndex: 'line',
          key: 'line',
          align: 'center',
          render: (value: any, row: any, rowindex: number) => {
            return onCellRender(value, row, rowindex, 'line')
          }
        },
        {
          title: '生产批次号',
          dataIndex: 'batchNo',
          key: 'batchNo',
          align: 'center',
          render: (value: any, row: any, rowindex: number) => {
            return onCellRender(value, row, rowindex, 'batchNo')
          }
        },
        {
          title: '上班结存',
          dataIndex: 'preqty',
          key: 'preqty',
          align: 'center',
          render: (value: any, row: any, rowindex: number) => {
            return onCellRender(value, row, rowindex, 'preqty')
          }
        },
        {
          title: '本班流入',
          dataIndex: 'curintqty',
          key: 'curintqty',
          align: 'center',
          render: (value: any, row: any, rowindex: number) => {
            return onCellRender(value, row, rowindex, 'curintqty')
          }
        },
        {
          title: '本班产量',
          dataIndex: 'curqty',
          key: 'curqty',
          align: 'center',
          render: (value: any, row: any, rowindex: number) => {
            return onCellRender(value, row, rowindex, 'curqty')
          }
        },
        {
          title: '本班结存',
          dataIndex: 'curtotalqty',
          key: 'curtotalqty',
          align: 'center',
          render: (value: any, row: any, rowindex: number) => {
            return onCellRender(value, row, rowindex, 'curtotalqty')
          }
        },
        {
          title: '返工片',
          dataIndex: 'returnqty',
          key: 'returnqty',
          align: 'center',
          render: (value: any, row: any, rowindex: number) => {
            return onCellRender(value, row, rowindex, 'returnqty')
          }
        },
        {
          title: '碎片',
          children: [
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
              title: '报废',
              dataIndex: 'srcapqty',
              key: 'srcapqty',
              align: 'center',
              render: (value: any, row: any, rowindex: number) => {
                return onCellRender(value, row, rowindex, 'srcapqty')
              }
            }
          ]
        },
        {
          title: '碎片率',
          dataIndex: 'fragmentrate',
          key: 'fragmentrate',
          align: 'center',
          render: (value: any, row: any, rowindex: number) => {
            return onCellRender(value, row, rowindex, 'fragmentrate')
          }
        },
        {
          title: '备注(生产异常)',
          dataIndex: 'remark',
          key: 'remark',
          align: 'center',
          render: (value: any, row: any, rowindex: number) => {
            return onCellRender(value, row, rowindex, 'remark')
          }
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

export default GridProductDetail

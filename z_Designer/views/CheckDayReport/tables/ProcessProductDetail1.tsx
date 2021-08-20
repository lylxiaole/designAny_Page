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

const ProcessProductDetail1 = React.forwardRef((props: any, ref: any) => {
  let newdata = props.serverData;
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
    // if (columnDataField === 'process' || columnDataField === 'remark') {
    //   //计算原始数据里的行数组
    //   let rowspanArr = []
    //   for (let index = 0; index < newdata.length; index++) {
    //     const element = newdata[index]
    //     if (element['process'] === row['process']) {
    //       rowspanArr.push(index)
    //     }
    //   }
    //   // window.console.log('onCellRender:' + columnDataField, rowspanArr)
    //   //
    //   if (rowspanArr.length > 1 && rowindex === rowspanArr[0]) {
    //     obj.props.rowSpan = rowspanArr.length
    //   } else if (rowspanArr.length > 1 && rowindex !== rowspanArr[0]) {
    //     obj.props.rowSpan = 0
    //   }
    // }

    if (columnDataField === 'class') {
      // window.console.log('columnDataField:',row[columnDataField])
      let rowspanArr = []
      for (let index = 0; index < newdata.length; index++) {
        const rowdata = newdata[index]
        if (rowdata['class'] === row['class']) {
          rowspanArr.push(index)
        }
      }

      if (rowspanArr.length > 1 && rowindex === rowspanArr[0]) {
        obj.props.rowSpan = rowspanArr.length
      } else if (rowspanArr.length > 1 && rowindex !== rowspanArr[0]) {
        obj.props.rowSpan = 0
      }
    }
    if (columnDataField === 'process') {
      // window.console.log('columnDataField:',row[columnDataField])
      let rowspanArr = []
      for (let index = 0; index < newdata.length; index++) {
        const rowdata = newdata[index]
        if (rowdata['process'] === row['process']) {
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
    // if (row['process'] === '合计' && row['line'] === '合计' && row['batchNo'] === '合计') {
    //   if (columnDataField === 'process') {
    //     obj.props.colSpan = 3
    //   } else if (columnDataField === 'line' || columnDataField === 'batchNo') {
    //     obj.props.colSpan = 0
    //   }
    // }

    // if (row['batchNo'] === '合计1xxx') {
    //   let keys = Object.keys(row)
    //   // window.console.log('columnDataField:', columnDataField)
    //   if (columnDataField === 'process') {
    //     obj.props.colSpan = 8
    //     obj.children = ''
    //   } else if (columnDataField === 'fragmentrate') {
    //     obj.props.colSpan = 1
    //   } else if (columnDataField === 'remark') {
    //     obj.props.colSpan = 3
    //   } else {
    //     obj.props.colSpan = 0
    //   }
    // }

    return obj
  }
  const columnsJson: any[] = [
    {
      title: '',
      dataIndex: 'process',
      key: 'process',
      align: 'center',
      render: (value: any, row: any, rowindex: number) => {
        return onCellRender(value, row, rowindex, 'process')
      }
    },
    {
      title: '',
      dataIndex: 'class',
      key: 'class',
      align: 'center',
      render: (value: any, row: any, rowindex: number) => {
        return onCellRender(value, row, rowindex, 'class')
      }
    },
    {
      title: '项目',
      dataIndex: 'item',
      key: 'item',
      align: 'center'
    },
    {
      title: 'A-级',
      align: 'center',
      children: [
        {
          title: '白',
          dataIndex: 'aSubDayShift1',
          key: 'aSubDayShift1',
          align: 'center'
        },
        {
          title: '夜',
          dataIndex: 'aSubNightShift1',
          key: 'aSubNightShift1',
          align: 'center'
        }
      ]
    },
    {
      title: 'A-级小计',
      dataIndex: 'aSubSubtotal1',
      key: 'aSubSubtotal1',
      align: 'center'
    },
    {
      title: '百分比',
      dataIndex: 'aSubPercent1',
      key: 'aSubPercent1',
      align: 'center',
      render: (value: any, row: any, rowindex: number) => {
        if (value) {
          return (value * 100).toFixed(2) + '%'
        }
      }
    },
    {
      title: 'C级',
      align: 'center',
      children: [
        {
          title: '白',
          dataIndex: 'cDayShift1',
          key: 'cDayShift1',
          align: 'center'
        },
        {
          title: '夜',
          dataIndex: 'cNightShift1',
          key: 'cNightShift1',
          align: 'center'
        }
      ]
    },
    {
      title: 'C级小计',
      dataIndex: 'cSubtotal1',
      key: 'cSubtotal1',
      align: 'center'
    },
    {
      title: '百分比',
      dataIndex: 'cPercent1',
      key: 'cPercent1',
      align: 'center',
      render: (value: any, row: any, rowindex: number) => {
        if (value) {
          return (value * 100).toFixed(2) + '%'
        }
      }
    },
    {
      title: '项目',
      dataIndex: 'item',
      key: 'item',
      align: 'center'
    },
    {
      title: 'A-级',
      align: 'center',
      children: [
        {
          title: '白',
          dataIndex: 'aSubDayShift2',
          key: 'aSubDayShift2',
          align: 'center'
        },
        {
          title: '夜',
          dataIndex: 'aSubNightShift2',
          key: 'aSubNightShift2',
          align: 'center'
        }
      ]
    },
    {
      title: 'A-级小计',
      dataIndex: 'aSubSubtotal2',
      key: 'aSubSubtotal2',
      align: 'center'
    },
    {
      title: '百分比',
      dataIndex: 'aSubPercent2',
      key: 'aSubPercent2',
      align: 'center',
      render: (value: any, row: any, rowindex: number) => {
        if (value) {
          return (value * 100).toFixed(2) + '%'
        }
      }
    },
    {
      title: 'C级',
      align: 'center',
      children: [
        {
          title: '白',
          dataIndex: 'cDayShift2',
          key: 'cDayShift2',
          align: 'center'
        },
        {
          title: '夜',
          dataIndex: 'cNightShift2',
          key: 'cNightShift2',
          align: 'center'
        }
      ]
    },
    {
      title: 'C级小计',
      dataIndex: 'cSubtotal2',
      key: 'cSubtotal2',
      align: 'center'
    },
    {
      title: '百分比',
      dataIndex: 'cPercent2',
      key: 'cPercent2',
      align: 'center',
      render: (value: any, row: any, rowindex: number) => {
        if (value) {
          return (value * 100).toFixed(2) + '%'
        }
      }
    },
    {
      title: '合计',
      align: 'center',
      children: [
        {
          title: 'A-级',
          dataIndex: 'aSubTotal',
          key: 'aSubTotal',
          align: 'center'
        },
        {
          title: 'C级',
          dataIndex: 'cTotal',
          key: 'cTotal',
          align: 'center'
        }
      ]
    },
  ]

  return (
    <div ref={ref}>
      <Table className={styles.paddingStyle} columns={columnsJson} dataSource={newdata} bordered size="middle" pagination={false} />
    </div>
  )
})

export default ProcessProductDetail1

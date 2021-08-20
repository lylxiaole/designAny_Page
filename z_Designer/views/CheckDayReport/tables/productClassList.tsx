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

const ProductClassList = React.forwardRef((props: any, ref: any) => {
  let newdata = props.serverData
  console.log(newdata);
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
      title: '电池检验日报表',
      align: 'left',
      children: [
        {
          title: '项目',
          children: [
            {
              title: '分类',
              dataIndex: 'class',
              key: 'class',
              align: 'center',
              render: (value: any, row: any, rowindex: number) => {
                return onCellRender(value, row, rowindex, 'class')
              }
            },
            {
              title: '效率%',
              dataIndex: 'effc',
              key: 'effc',
              align: 'right',
              // render: (value: any, row: any, rowindex: number) => {
              //   return onCellRender(value, row, rowindex, 'effc')
              // }
            }
          ]
        },
        {
          title: '一线',
          children: [
            {
              title: '白班(A)',
              children: [
                {
                  title: 'A',
                  dataIndex: 'aDayShift1',
                  key: 'aDayShift1',
                  align: 'center',
                  render: (value: any, row: any, rowindex: number) => {
                    return onCellRender(value, row, rowindex, 'aDayShift1')
                  }
                },
                {
                  title: 'A-',
                  dataIndex: 'aSubDayShift1',
                  key: 'aSubDayShift1',
                  align: 'center',
                  render: (value: any, row: any, rowindex: number) => {
                    return onCellRender(value, row, rowindex, 'aSubDayShift1')
                  }
                },
                {
                  title: 'C',
                  dataIndex: 'cDayShift1',
                  key: 'cDayShift1',
                  align: 'center',
                  render: (value: any, row: any, rowindex: number) => {
                    return onCellRender(value, row, rowindex, 'cDayShift1')
                  }
                }
              ]
            },
            {
              title: '夜班(B)',
              children: [
                {
                  title: 'A',
                  dataIndex: 'aNightShift1',
                  key: 'aNightShift1',
                  align: 'center',
                  render: (value: any, row: any, rowindex: number) => {
                    return onCellRender(value, row, rowindex, 'aNightShift1')
                  }
                },
                {
                  title: 'A-',
                  dataIndex: 'aSubNightShift1',
                  key: 'aSubNightShift1',
                  align: 'center',
                  render: (value: any, row: any, rowindex: number) => {
                    return onCellRender(value, row, rowindex, 'aSubNightShift1')
                  }
                },
                {
                  title: 'C',
                  dataIndex: 'cNightShift1',
                  key: 'cNightShift1',
                  align: 'center',
                  render: (value: any, row: any, rowindex: number) => {
                    return onCellRender(value, row, rowindex, 'cNightShift1')
                  }
                }
              ]
            },
            {
              title: '小计',
              dataIndex: 'subtotal1',
              key: 'subtotal1',
              align: 'center',
              render: (value: any, row: any, rowindex: number) => {
                return onCellRender(value, row, rowindex, 'subtotal1')
              }
            },
            {
              title: '百分比',
              dataIndex: 'percent1',
              key: 'percent1',
              align: 'center',
              render: (value: any, row: any, rowindex: number) => {
                if (value != "") {
                  if (value) {
                    return (value * 100).toFixed(2) + '%'
                  }
                }
              }
            },
          ]
        },
        {
          title: '二线',
          children: [
            {
              title: '白班(A)',
              children: [
                {
                  title: 'A',
                  dataIndex: 'aDayShift2',
                  key: 'aDayShift2',
                  align: 'center',
                  render: (value: any, row: any, rowindex: number) => {
                    return onCellRender(value, row, rowindex, 'aDayShift2')
                  }
                },
                {
                  title: 'A-',
                  dataIndex: 'aSubDayShift2',
                  key: 'aSubDayShift2',
                  align: 'center',
                  render: (value: any, row: any, rowindex: number) => {
                    return onCellRender(value, row, rowindex, 'aSubDayShift2')
                  }
                },
                {
                  title: 'C',
                  dataIndex: 'cDayShift2',
                  key: 'cDayShift2',
                  align: 'center',
                  render: (value: any, row: any, rowindex: number) => {
                    return onCellRender(value, row, rowindex, 'cDayShift2')
                  }
                }
              ]
            },
            {
              title: '夜班(B)',
              children: [
                {
                  title: 'A',
                  dataIndex: 'aNightShift2',
                  key: 'aNightShift2',
                  align: 'center',
                  render: (value: any, row: any, rowindex: number) => {
                    return onCellRender(value, row, rowindex, 'aNightShift2')
                  }
                },
                {
                  title: 'A-',
                  dataIndex: 'aSubNightShift2',
                  key: 'aSubNightShift2',
                  align: 'center',
                  render: (value: any, row: any, rowindex: number) => {
                    return onCellRender(value, row, rowindex, 'aSubNightShift2')
                  }
                },
                {
                  title: 'C',
                  dataIndex: 'cNightShift2',
                  key: 'cNightShift2',
                  align: 'center',
                  render: (value: any, row: any, rowindex: number) => {
                    return onCellRender(value, row, rowindex, 'cNightShift2')
                  }
                }
              ]
            },
            {
              title: '小计',
              dataIndex: 'subtotal2',
              key: 'subtotal2',
              align: 'center',
              render: (value: any, row: any, rowindex: number) => {
                return onCellRender(value, row, rowindex, 'subtotal2')
              }
            },
            {
              title: '百分比',
              dataIndex: 'percent2',
              key: 'percent2',
              align: 'center',
              render: (value: any, row: any, rowindex: number) => {
                if (value) {
                  if (value) {
                    return (value * 100).toFixed(2) + '%'
                  }
                }
              }
            },
          ]
        },
      ]
    },
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
              align: 'center',
              render: (value: any, row: any, rowindex: number) => {
                if (value) {
                  return (value * 100).toFixed(2) + '%'
                }
              }
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

export default ProductClassList

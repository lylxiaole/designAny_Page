import React, { useEffect, useImperativeHandle, useRef } from 'react'
import { Table, InputNumber } from 'antd'

import styles from '../index.module.less'
import { toTableData_JiangliaoUseDetail } from '../dataAdapter'
import { jiangliaowangbanBig } from '../testData'

const JiangliaoWangbanUseDetail = React.forwardRef((props: any, ref: any) => {
  let serverdata = props.serverData
  // if (process.env.NODE_ENV === 'development') {
  //   serverdata = jiangliaowangbanBig
  // }
  let newdata = toTableData_JiangliaoUseDetail(serverdata)

  const divref = useRef(null)

  /**ref绑定到当前组件，并对外开放 getDataSource方法*/
  useImperativeHandle(ref, () => ({
    getDataSource: () => {
      return {
        oldData: serverdata,
        newDataSource: newdata
      }
    },
    dom: divref.current
  }))

  // **********************************************************************
  const onCellRender = (value: any, row: any, rowindex: number, columnDataField: string) => {
    const obj: any = {
      children: value,
      props: {
        rowSpan: 1,
        colSpan: 1
      }
    }
    // **********单元格合并*************************************
    if (row['key'] === '网版头') {
      if (columnDataField === 'mainClass') {
        obj.props.colSpan = 6
      } else if (columnDataField === 'mainClass' || columnDataField === 'xiaokufaliao_two' || columnDataField === 'xiaokufaliao_three' || columnDataField === 'xiaokufaliao_four' || columnDataField === 'xiaokufaliao_five') {
        obj.props.colSpan = 4
      } else {
        obj.props.colSpan = 0
      }
    }

    if (row['key'] === '网版头2') {
      if (columnDataField === 'mainClass') {
        obj.props.colSpan = 2
      } else if (columnDataField === 'secondClass') {
        obj.props.colSpan = 0
      }
    }
    // **********主分类单元格合并*************************************
    if (columnDataField === 'mainClass' && row['mainClass'] !== '合计') {
      let firstIndex = newdata.findIndex((o) => o.mainClass === value)
      if (firstIndex === rowindex) {
        obj.props.rowSpan = newdata.filter((o) => o.mainClass === value).length
      } else {
        obj.props.rowSpan = 0
      }
    } else if (columnDataField === 'mainClass' && row.key.indexOf('合计') > -1) {
      obj.props.colSpan = 2
    } else if (columnDataField === 'secondClass' && row.key.indexOf('合计') > -1) {
      obj.props.colSpan = 0
    }
    // **********单元格可编辑*************************************
    if (row['key'] === '网版头2' || row['key'] === '网版头' || row['key'].indexOf('合计') > -1) {
      return obj
    }

    if (columnDataField === 'mainClass' || columnDataField === 'secondClass') {
      return obj
    }

    if (props.isEditing) {
      obj.children = (
        <InputNumber
          defaultValue={row[columnDataField]}
          onChange={(val: any) => {
            row[columnDataField] = val
          }}
        />
      )
    }
    return obj
  }
  // **********************************************************************
  const columnsJson: any[] = [
    {
      title: '浆料，网版使用情况',
      align: 'left',
      children: [
        {
          title: '一道浆料',
          align: 'center',
          children: [
            {
              title: '浆料分类',
              dataIndex: 'mainClass',
              key: 'mainClass',
              align: 'center',
              colSpan: 2,
              render: (value: any, row: any, rowindex: number) => {
                return onCellRender(value, row, rowindex, 'mainClass')
              }
            },
            {
              title: '浆料分类-次',
              dataIndex: 'secondClass',
              key: 'secondClass',
              align: 'center',
              colSpan: 0,
              render: (value: any, row: any, rowindex: number) => {
                return onCellRender(value, row, rowindex, 'secondClass')
              }
            },
            {
              title: '小库发料(kg)',
              dataIndex: 'xiaokufaliao_one',
              key: 'xiaokufaliao_one',
              align: 'center',
              render: (value: any, row: any, rowindex: number) => {
                return onCellRender(value, row, rowindex, 'xiaokufaliao_one')
              }
            },
            {
              title: '上班结存(kg)',
              dataIndex: 'preqty_one',
              key: 'preqty_one',
              align: 'center',
              render: (value: any, row: any, rowindex: number) => {
                return onCellRender(value, row, rowindex, 'preqty_one')
              }
            },
            {
              title: '本班消耗(kg)',
              dataIndex: 'benbanxiaohao_one',
              key: 'benbanxiaohao_one',
              align: 'center',
              render: (value: any, row: any, rowindex: number) => {
                return onCellRender(value, row, rowindex, 'benbanxiaohao_one')
              }
            },
            {
              title: '本班结存(kg)',
              dataIndex: 'curtotalqty_one',
              key: 'curtotalqty_one',
              align: 'center',
              render: (value: any, row: any, rowindex: number) => {
                return onCellRender(value, row, rowindex, 'curtotalqty_one')
              }
            }
          ]
        },
        {
          title: '二道浆料',
          align: 'center',
          children: [
            {
              title: '小库发料(kg)',
              dataIndex: 'xiaokufaliao_two',
              key: 'xiaokufaliao_two',
              align: 'center',
              render: (value: any, row: any, rowindex: number) => {
                return onCellRender(value, row, rowindex, 'xiaokufaliao_two')
              }
            },
            {
              title: '上班结存(kg)',
              dataIndex: 'preqty_two',
              key: 'preqty_two',
              align: 'center',
              render: (value: any, row: any, rowindex: number) => {
                return onCellRender(value, row, rowindex, 'preqty_two')
              }
            },
            {
              title: '本班消耗(kg)',
              dataIndex: 'benbanxiaohao_two',
              key: 'benbanxiaohao_two',
              align: 'center',
              render: (value: any, row: any, rowindex: number) => {
                return onCellRender(value, row, rowindex, 'benbanxiaohao_two')
              }
            },
            {
              title: '本班结存(kg)',
              dataIndex: 'curtotalqty_two',
              key: 'curtotalqty_two',
              align: 'center',
              render: (value: any, row: any, rowindex: number) => {
                return onCellRender(value, row, rowindex, 'curtotalqty_two')
              }
            }
          ]
        },

        {
          title: '三道浆料',
          align: 'center',
          children: [
            {
              title: '小库发料(kg)',
              dataIndex: 'xiaokufaliao_three',
              key: 'xiaokufaliao_three',
              align: 'center',
              render: (value: any, row: any, rowindex: number) => {
                return onCellRender(value, row, rowindex, 'xiaokufaliao_three')
              }
            },
            {
              title: '上班结存(kg)',
              dataIndex: 'preqty_three',
              key: 'preqty_three',
              align: 'center',
              render: (value: any, row: any, rowindex: number) => {
                return onCellRender(value, row, rowindex, 'preqty_three')
              }
            },
            {
              title: '本班消耗(kg)',
              dataIndex: 'benbanxiaohao_three',
              key: 'benbanxiaohao_three',
              align: 'center',
              render: (value: any, row: any, rowindex: number) => {
                return onCellRender(value, row, rowindex, 'benbanxiaohao_three')
              }
            },
            {
              title: '本班结存(kg)',
              dataIndex: 'curtotalqty_three',
              key: 'curtotalqty_three',
              align: 'center',
              render: (value: any, row: any, rowindex: number) => {
                return onCellRender(value, row, rowindex, 'curtotalqty_three')
              }
            }
          ]
        },
        {
          title: '四道浆料',
          align: 'center',
          children: [
            {
              title: '小库发料(kg)',
              dataIndex: 'xiaokufaliao_four',
              key: 'xiaokufaliao_four',
              align: 'center',
              render: (value: any, row: any, rowindex: number) => {
                return onCellRender(value, row, rowindex, 'xiaokufaliao_four')
              }
            },
            {
              title: '上班结存(kg)',
              dataIndex: 'preqty_four',
              key: 'preqty_four',
              align: 'center',
              render: (value: any, row: any, rowindex: number) => {
                return onCellRender(value, row, rowindex, 'preqty_four')
              }
            },
            {
              title: '本班消耗(kg)',
              dataIndex: 'benbanxiaohao_four',
              key: 'benbanxiaohao_four',
              align: 'center',
              render: (value: any, row: any, rowindex: number) => {
                return onCellRender(value, row, rowindex, 'benbanxiaohao_four')
              }
            },
            {
              title: '本班结存(kg)',
              dataIndex: 'curtotalqty_four',
              key: 'curtotalqty_four',
              align: 'center',
              render: (value: any, row: any, rowindex: number) => {
                return onCellRender(value, row, rowindex, 'curtotalqty_four')
              }
            }
          ]
        },
        {
          title: '五道浆料',
          align: 'center',
          children: [
            {
              title: '小库发料(kg)',
              dataIndex: 'xiaokufaliao_five',
              key: 'xiaokufaliao_five',
              align: 'center',
              render: (value: any, row: any, rowindex: number) => {
                return onCellRender(value, row, rowindex, 'xiaokufaliao_five')
              }
            },
            {
              title: '上班结存(kg)',
              dataIndex: 'preqty_five',
              key: 'preqty_five',
              align: 'center',
              render: (value: any, row: any, rowindex: number) => {
                return onCellRender(value, row, rowindex, 'preqty_five')
              }
            },
            {
              title: '本班消耗(kg)',
              dataIndex: 'benbanxiaohao_five',
              key: 'benbanxiaohao_five',
              align: 'center',
              render: (value: any, row: any, rowindex: number) => {
                return onCellRender(value, row, rowindex, 'benbanxiaohao_five')
              }
            },
            {
              title: '本班结存(kg)',
              dataIndex: 'curtotalqty_five',
              key: 'curtotalqty_five',
              align: 'center',
              render: (value: any, row: any, rowindex: number) => {
                return onCellRender(value, row, rowindex, 'curtotalqty_five')
              }
            }
          ]
        }
      ]
    }
  ]

  let tableprops: any = { className: styles.paddingStyle, columns: columnsJson, dataSource: newdata, bordered: true, size: 'middle', pagination: false }
  return <div ref={divref}>{React.createElement(Table, tableprops)}</div>
})

export default JiangliaoWangbanUseDetail

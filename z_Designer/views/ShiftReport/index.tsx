import PageBase from '@src/views/PageBase'
import React from 'react'
import { Row, Col } from 'antd'
import Form, { ButtonItem, Item, GroupItem, SimpleItem } from 'devextreme-react/form'
import styles from './index.module.less'
import { rtnData } from './dataAdapter'
import { GetInOutput, Getproduction, GetMateiralConsume, GetMateiralConsumeDetaial, UpdateMateiralConsume } from '../../utils/service'

import GridProductDetail from './tables/GridProductDetail'
import JiangliaoWangbanUseDetail from './tables/JiangliaoWangbanUseDetail'
import ProcessProductDetail1 from './tables/ProcessProductDetail1'
import ProcessProductDetail2 from './tables/ProcessProductDetail2'
import JiangliaoWangbanSaved from './tables/JiangliaoWangbanSaved'
import JiangliaoWangbanUsed from './tables/JiangliaoWangbanUsed'
function FilterDom(props: any) {
  const shiftList: any[] = ['白班', '夜班']

  let editBtn = (
    <ButtonItem
      horizontalAlignment="left"
      visible={props.isEditing === false}
      buttonOptions={{
        width: '80px',
        text: '编辑',
        type: 'default',
        useSubmitBehavior: true,
        style: { float: 'left' },
        onClick: () => {
          props.onEditChanged(true)
        }
      }}
    />
  )

  let serchBtn = (
    <ButtonItem
      horizontalAlignment="left"
      visible={props.isEditing === false}
      buttonOptions={{
        width: '80px',
        text: '查询',
        type: 'default',
        useSubmitBehavior: true,
        style: { float: 'left' },
        onClick: () => {
          props.onSearch(props.formData)
        }
      }}
    />
  )

  let exportBtn = (
    <ButtonItem
      horizontalAlignment="left"
      visible={props.isEditing === false}
      buttonOptions={{
        width: '120px',
        text: '导出excel',
        type: 'default',
        useSubmitBehavior: true,
        style: { float: 'left' },
        onClick: () => {
          props.onExportExcel()
        }
      }}
    />
  )

  let saveBtn = (
    <ButtonItem
      horizontalAlignment="left"
      visible={props.isEditing === true}
      buttonOptions={{
        width: '80px',
        text: '保存',
        type: 'default',
        useSubmitBehavior: true,
        style: { float: 'left' },
        onClick: () => {
          props.onEditChanged(false)
        }
      }}
    />
  )

  return (
    <div className={styles.paddingStyle}>
      <Form id="form" labelLocation={'left'} style={{ height: '50px' }} colCount={6} formData={props.formData}>
        <Item
          dataField="chooseDate"
          label={{ text: '日期' }}
          editorType="dxDateBox"
          editorOptions={{
            disabled: false,
            type: 'datetime',
            openOnFieldClick: true
          }}
          validationRules={[
            {
              type: 'required',
              message: '必填'
            }
          ]}
        />

        <Item
          dataField="selectedProduction"
          label={{ text: '产品' }}
          editorType="dxSelectBox"
          editorOptions={{
            placeholder: '请选择',
            dataSource: props.productions,
            displayExpr: 'value',
            valueExpr: 'value',
            showSelectionControls: true
          }}
        />
        <Item
          dataField="shift_name"
          label={{ text: '班次' }}
          editorType="dxSelectBox"
          editorOptions={{
            placeholder: '请选择',
            dataSource: shiftList,
            showSelectionControls: true
          }}
        />
        {serchBtn}
        {exportBtn}
        {editBtn}
        {saveBtn}
      </Form>
    </div>
  )
}

export default class Index extends PageBase<any, any> {
  private GridProductDetailRef = React.createRef<Element>()
  private GridProductDetail1Ref = React.createRef<Element>()
  private GridProductDetail2Ref = React.createRef<Element>()
  private JiangliaoWangbanUseDetailRef = React.createRef<any>()
  private JiangliaoWangbanUsedRef = React.createRef<Element>()
  private JiangliaoWangbanSavedRef = React.createRef<Element>()

  constructor(props: any) {
    super(props)

    this.state = {
      gridProductDetailData: null,
      mateiralConsume: null,
      isEditing: false,
      consumeDetaialData: [],
      productions: [],
      formData: {
        selectedProduction: '123456789',
        shift_name: '白班',
        chooseDate: new Date().toLocaleDateString()
      }
    }
  }

  render() {
    return (
      <div style={{ height: '100%', width: '100%', overflow: 'auto' }}>
        <FilterDom formData={this.state.formData} productions={this.state.productions} onSearch={this.onSearch} onExportExcel={this.onExportExcel} isEditing={this.state.isEditing} onEditChanged={this.onEditChanged} />
        <GridProductDetail ref={this.GridProductDetailRef} serverData={this.state.gridProductDetailData} />
        <JiangliaoWangbanUseDetail ref={this.JiangliaoWangbanUseDetailRef} serverData={this.state.mateiralConsume} isEditing={this.state.isEditing} />
        <Row>
          <Col span={12}>
            <ProcessProductDetail1 ref={this.GridProductDetail1Ref} serverData={this.state.gridProductDetailData} />
          </Col>
          <Col span={12}>
            <ProcessProductDetail2 ref={this.GridProductDetail2Ref} serverData={this.state.gridProductDetailData} />
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <JiangliaoWangbanUsed ref={this.JiangliaoWangbanUsedRef} serverData={this.state.consumeDetaialData} />
          </Col>
          <Col span={12}>
            <JiangliaoWangbanSaved ref={this.JiangliaoWangbanSavedRef} serverData={this.state.consumeDetaialData} />
          </Col>
        </Row>
      </div>
    )
  }
  componentDidMount() {
    Getproduction().then(async (productions: any) => {
      window.console.log(productions)
      let formDatac = { ...this.state.formData }
      formDatac.selectedProduction = productions[0].value

      this.setState({ productions: productions, formData: formDatac }, async () => {
        await this.onSearch(formDatac)
      })
    })
  }

  onSearch = async (params: any) => {
    // window.console.log('onSearch', params)
    let production = this.state.productions.find((o: any) => o.value === params.selectedProduction)
    if (params.chooseDate) {
      params.chooseDate = this.dateToStr(new Date(params.chooseDate))
    }

    let data = {
      shiftDay: params.chooseDate,
      shiftName: params.shift_name,
      batchno: production.key,
      batchname: production.value
    }

    let productDetailData = (await GetInOutput(data)) as rtnData
    let mateiralConsume = await GetMateiralConsume(data)
    let consumeDetaialData = await GetMateiralConsumeDetaial(data)
    this.setState({
      gridProductDetailData: productDetailData,
      mateiralConsume: mateiralConsume,
      consumeDetaialData: consumeDetaialData
    })
  }

  private dateToStr(datetime: any) {
    datetime.setDate(datetime.getDate())
    var year = datetime.getFullYear()
    var month = datetime.getMonth() + 1 //js从0开始取
    var date = datetime.getDate()
    var hour = datetime.getHours()
    var m = datetime.getMinutes()
    month = month < 10 ? '0' + month : month
    date = date < 10 ? '0' + date : date
    hour = hour < 10 ? '0' + hour : hour
    return year + '-' + month + '-' + date
  }

  onEditChanged = async (isediting: boolean) => {
    if (isediting === true) {
      this.setState({ isEditing: isediting })
      return
    }

    let production = this.state.productions.find((o: any) => o.value === this.state.formData.selectedProduction)
    if (this.state.formData.chooseDate) {
      this.state.formData.chooseDate = this.dateToStr(new Date(this.state.formData.chooseDate))
    }

    let data = {
      shiftDay: this.state.formData.chooseDate,
      shiftName: this.state.formData.shift_name,
      batchno: production.key,
      batchname: production.value
    }

    // window.console.log('onEditChanged:', isediting)
    let { newDataSource, oldData } = this.JiangliaoWangbanUseDetailRef.current.getDataSource()
    for (let index = 0; index < oldData.length; index++) {
      const odata = oldData[index]
      odata.shiftDay = data.shiftDay
      odata.shiftName = data.shiftName
      odata.batchno = data.batchno
      odata.batchname = data.batchname
      let level = odata.level
      for (let jndex = 0; jndex < odata.col.length; jndex++) {
        const col = odata.col[jndex]

        for (let kndex = 0; kndex < col.dets.length; kndex++) {
          const det = col.dets[kndex]
          let newsource = newDataSource.find((o: any) => o.mainClass === col.type && o.secondClass === det.itemName)

          if (level % 5 === 1) {
            det.input = newsource.xiaokufaliao_one
            det.lastsettlement = newsource.preqty_one
            det.consumption = newsource.benbanxiaohao_one
            det.settlement = newsource.curtotalqty_one
          } else if (level % 5 === 2) {
            det.input = newsource.xiaokufaliao_two
            det.lastsettlement = newsource.preqty_two
            det.consumption = newsource.benbanxiaohao_two
            det.settlement = newsource.curtotalqty_two
          } else if (level % 5 === 3) {
            det.input = newsource.xiaokufaliao_three
            det.lastsettlement = newsource.preqty_three
            det.consumption = newsource.benbanxiaohao_three
            det.settlement = newsource.curtotalqty_three
          } else if (level % 5 === 4) {
            det.input = newsource.xiaokufaliao_four
            det.lastsettlement = newsource.preqty_four
            det.consumption = newsource.benbanxiaohao_four
            det.settlement = newsource.curtotalqty_four
          } else if (level % 5 === 0) {
            det.input = newsource.xiaokufaliao_five
            det.lastsettlement = newsource.preqty_five
            det.consumption = newsource.benbanxiaohao_five
            det.settlement = newsource.curtotalqty_five
          }
        }
      }
    }

    await UpdateMateiralConsume(oldData)
    this.setState({ isEditing: isediting })
    await this.onSearch(this.state.formData)
  }

  onExportExcel = (e: any) => {
    // window.console.log('this.JiangliaoWangbanUseDetailRef.current:', this.JiangliaoWangbanUseDetailRef)

    let jqarr = $($(this.GridProductDetailRef.current as any).find('table'))
      .add($(this.GridProductDetail1Ref.current as any).find('table'))
      .add($(this.GridProductDetail2Ref.current as any).find('table'))
      .add($(this.JiangliaoWangbanUseDetailRef.current.dom as any).find('table'))
      .add($(this.JiangliaoWangbanUsedRef.current as any).find('table'))
      .add($(this.JiangliaoWangbanSavedRef.current as any).find('table'))
    // *******************************************
    $(jqarr)
      .find('td')
      .map((index: number, o: any) => {
        $(o).attr('data-tableexport-xlsxformatid', index + 1)
        let contentstr = $(o).html()
        if (contentstr.indexOf('%') > -1) {
          window.console.log('contentstr:', contentstr)
          $(o).attr('data-tableexport-msonumberformat', 'Percent')
        } else {
          $(o).attr('data-tableexport-msonumberformat', '@')
        }
      })
    // *******************************************
    ;($(jqarr) as any).tableExport({
      type: 'excel',
      mso: {
        fileFormat: 'xls'
      },
      preventInjection: false
    })
  }
}

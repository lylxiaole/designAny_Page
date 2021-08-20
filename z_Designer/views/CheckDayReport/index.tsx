import PageBase from '@src/views/PageBase'
import React from 'react'
import { Row, Col } from 'antd'
import $ from 'jquery'
import Form, { ButtonItem, Item, GroupItem, SimpleItem } from 'devextreme-react/form'
import styles from './index.scss'
import { rtnData } from './dataAdapter'
import { Getproduction, GetData } from './service'

import ProductClassList from './tables/productClassList'
import TotalList from './tables/totalList'
import ProcessProductDetail1 from './tables/ProcessProductDetail1' 
import saveAs from 'file-saver'

function FilterDom(props: any) {
  const shiftList: any[] = ['白班', '夜班']
  // const productions: any[] = ['123456789']
  // onExportExcel
  return (
    <div className={styles.paddingStyle}>
      <Form id="form" labelLocation={'left'} style={{ height: '50px' }} colCount={5} formData={props.formData}>
        <Item
          dataField="chooseDate"
          label={{ text: '日期' }}
          editorType="dxDateBox"
          editorOptions={{
            disabled: false,
            type: 'date',
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
        <ButtonItem
          horizontalAlignment="left"
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
        <ButtonItem
          horizontalAlignment="left"
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
      </Form>
    </div>
  )
}


export default class Index extends PageBase<any, any> {
  private GridProductDetailRef = React.createRef<Element>()

  private GridProductDetail1Ref = React.createRef<Element>()
  private GridProductDetail2Ref = React.createRef<Element>()

  constructor(props: any) {
    super(props)

    this.state = {
      GridProductDetailData: null,
      mateiralConsume: null,
      productions: [],
      formData: {
        chooseDate: new Date().toLocaleDateString()
      }
    }
  }

  render() {
    return (
      <div style={{ height: '100%', width: '100%', overflow: 'auto' }}>
        <FilterDom formData={this.state.formData} productions={this.state.productions} onSearch={this.onSearch} onExportExcel={this.onExportExcel} />
        <ProductClassList ref={this.GridProductDetailRef} serverData={this.state.ProductClass} />
        {/* <TotalList ref={this.GridProductDetail1Ref} serverData={this.state.totalServerData} /> */}
        <ProcessProductDetail1 ref={this.GridProductDetail1Ref} serverData={this.state.productAppearanceList} />
        {/* <Row>
          <Col span={12}>
            
          </Col>
          <Col span={12}>
            <ProcessProductDetail2 ref={this.GridProductDetail2Ref} serverData={this.state.GridProductDetailData} />
          </Col>
        </Row> */}
        {/* <JiangliaoWangbanSaved serverData={this.state.mateiralConsume} />
        <JiangliaoWangbanUsed serverData={this.state.mateiralConsume} /> */}
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
      productCode: production.key,
    }

    let productDetailData: any = (await GetData(data)) as rtnData
    // let mateiralConsume = await GetMateiralConsume(data)
    //分类表格数据
    let productClassList = productDetailData.productClassList;
    var serverData: any = [];
    var columnList: any = [];
    for (var i = 0; i < productClassList.length; i++) {
      if (productClassList[i].line == "一线") {
        for (let key in productClassList[i]) {
          if (key != 'id' && key != 'line' && key != 'class') {
            productClassList[i][key + '1'] = productClassList[i][key]
          }
        }
      } else {
        for (let key in productClassList[i]) {
          if (key != 'id' && key != 'line' && key != 'class') {
            productClassList[i][key + '2'] = productClassList[i][key]
          }
        }
      }
    }
    for (var i = 0; i < productClassList.length; i++) {
      if (columnList.indexOf(productClassList[i].class + '-' + productClassList[i].effc) == -1) {
        serverData.push(productClassList[i]);
        columnList.push(productClassList[i].class + '-' + productClassList[i].effc)
      } else {
        for (var j = 0; j < serverData.length; j++) {
          if (serverData[j].class + '-' + serverData[j].effc == productClassList[i].class + '-' + productClassList[i].effc) {
            serverData[j] = JSON.parse((JSON.stringify(serverData[j]) + JSON.stringify(productClassList[i])).replace(/}{/, ','));
          }
        }
      }
    }
    // console.log(JSON.stringify(serverData[0]));//分类表格数据
     //小计数据拼接
    let cloneproductLevel = JSON.parse(JSON.stringify(productDetailData.productLevel));
    let productLevel:any = [];
    if(cloneproductLevel[0].line == '一线'){
      productLevel[0] = cloneproductLevel[0];
      productLevel[1] = cloneproductLevel[1];
    }else{
      productLevel[0] = cloneproductLevel[1];
      productLevel[1] = cloneproductLevel[0];
    }
    let json_row1 = { 
      "line": "",
      "class": "A级品", 
      "effc1": "<21.5%", 
      "aDayShift1": 'A级品数量', 
      "aSubDayShift1": productLevel[0].aQuantity, 
      "cDayShift1": '', 
      "aNightShift1": 'A级品率', 
      "aSubNightShift1": (productLevel[0].aRate * 100).toFixed(2)+'%', 
      "cNightShift1": 'A-数量', 
      "subtotal1": productLevel[0].aSubQuantity,
      "percent1": "",
      "effc2": "<21.5%", 
      "aDayShift2": 'A级品数量', 
      "aSubDayShift2": productLevel[1].aQuantity, 
      "cDayShift2": '', 
      "aNightShift2": 'A级品率', 
      "aSubNightShift2": (productLevel[1].aRate * 100).toFixed(2)+'%', 
      "cNightShift2": 'A-数量', 
      "subtotal2": productLevel[1].aSubQuantity, 
      "percent2": '',
      // "id":"",
      // "effc":"",
      // "aDayShift":0,
      // "aSubDayShift":0,
      // "cDayShift":500,
      // "aNightShift":0,
      // "aSubNightShift":0,
      // "cNightShift":0,
      // "subtotal":500,
      // "percent":0,
    }
    let json_row2 = { 
      "line": "",
      "class": "≥"+productLevel[0].nameValue, 
      "effc1": "<21.5%", 
      "aDayShift1": "≥"+productLevel[0].nameValue+'A级品数量', 
      "aSubDayShift1": productLevel[0].aCompareQuantity, 
      "cDayShift1": '', 
      "aNightShift1": "≥"+productLevel[0].nameValue+'A级品率', 
      "aSubNightShift1": (productLevel[0].aCompareRate * 100).toFixed(2)+'%', 
      "cNightShift1": 'A-数量比率', 
      "subtotal1": productLevel[0].aSubRate,
      "percent1": "",
      "effc2": "<21.5%", 
      "aDayShift2": "≥"+productLevel[0].nameValue+'A级品数量', 
      "aSubDayShift2": productLevel[1].aCompareQuantity, 
      "cDayShift2": '', 
      "aNightShift2": "≥"+productLevel[0].nameValue+'A级品率', 
      "aSubNightShift2": (productLevel[1].aCompareRate * 100).toFixed(2)+'%', 
      "cNightShift2": 'A-数量比率', 
      "subtotal2": (productLevel[1].aSubRate * 100).toFixed(2)+'%', 
      "percent2": '',
      // "id":"",
      // "effc":"",
      // "aDayShift":0,
      // "aSubDayShift":0,
      // "cDayShift":500,
      // "aNightShift":0,
      // "aSubNightShift":0,
      // "cNightShift":0,
      // "subtotal":500,
      // "percent":0,
    }
    serverData.push(json_row1);
    serverData.push(json_row2);
    // console.log(serverData)
   //小计数据
    let totalServerData = productDetailData.productTotalList;
    if (serverData.length >= totalServerData.length) {
      for (var i = 0; i < serverData.length; i++) {
        if (totalServerData[i] == undefined) {
        } else {
          serverData[i] = JSON.parse((JSON.stringify(serverData[i]) + JSON.stringify(totalServerData[i])).replace(/}{/, ','));
        }
      }
    } else {
      for (var i = 0; i < totalServerData.length; i++) {
        if (serverData[i] == undefined) {

        } else {
          totalServerData[i] = JSON.parse((JSON.stringify(serverData[i]) + JSON.stringify(totalServerData[i])).replace(/}{/, ','));
        }
      }
      serverData = totalServerData
    }
    //外观降级表格数据
    let productAppearanceList = productDetailData.productAppearanceList;
    for (var i = 0; i < productAppearanceList.length; i++) {
      productAppearanceList[i].process = '降级原因';
      if (productAppearanceList[i].line == "一线") {
        for (let key in productAppearanceList[i]) {
          if (key != 'id' && key != 'line' && key != 'class') {
            productAppearanceList[i][key + '1'] = productAppearanceList[i][key]
          }
        }
      } else {
        for (let key in productAppearanceList[i]) {
          if (key != 'id' && key != 'line' && key != 'class') {
            productAppearanceList[i][key + '2'] = productAppearanceList[i][key]
          }
        }
      }
    }

    this.setState({ ProductClass: serverData, totalServerData: totalServerData ,productAppearanceList:productAppearanceList})
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

  onExportExcel = (e: any) => {
    let jqarr = $($(this.GridProductDetailRef.current as any).find('table'))
      .add($(this.GridProductDetail1Ref.current as any).find('table'))
    // .add($(this.GridProductDetail2Ref.current as any).find('table'))

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
          $(o).attr('data-tableexport-msonumberformat', '0')
        }

        // $(o).attr('data-tableexport-value', '-5')
      })
      // *******************************************
      ; ($(jqarr) as any).tableExport({
        type: 'excel',
        mso: {
          fileFormat: 'xls'
        },
        preventInjection: false
      })

    // var blob = new Blob([xmlssData], { type: 'application/vnd.ms-excel;charset=utf-8' })
    // ;(saveAs as any)(blob, 'myfilename.xlsx')

    // exportSheetsMulit(jqarr)
    // window.console.log('onExportExcel:', ($(this.GridProductDetailRef.current as any).find('table') as any).tableExport)
    // ; ($(this.GridProductDetailRef.current as any).find('table') as any).tableExport({ type: 'excel' })
    // ; ($(this.GridProductDetail1Ref.current as any).find('table') as any).tableExport({ type: 'excel' })
    // ; ($(this.GridProductDetail2Ref.current as any).find('table') as any).tableExport({ type: 'excel' })
  }
}

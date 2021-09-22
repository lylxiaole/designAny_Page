/**
葡萄城对接报表组件
xuww add 2020-11-30
Dom元素主键使用动态id，区分出来设计页面和展示页面
*/
<template>
  <div :style="{ width: width + 'px', height: height + 'px'}">
    <div :id="'wyn-designer-root'+this.reportFrameId" class="wyn-designer" style="display: none;">
      <div :id="'designer-id'+this.reportFrameId" style="width: 100%; height: 100%;"></div>
      <div class="wd-app-container">
        <div :id="'save-as-dialog-id'+this.reportFrameId"
          style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;display: none;z-index: 9999;"></div>
        <div :id="'save-dialog-id'+this.reportFrameId"
          style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;display: none;z-index: 9999;"></div>
        <div :id="'data-set-picker-dialog-id'+this.reportFrameId"
          style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;display: none;z-index: 9999;background-color: #dedede;"></div>
      </div>
    </div>
    <div :id="'wyn-viewer-root'+this.reportFrameId" class="wyn-viewer" style="display: none;"></div>
  </div>
</template>

<script lang="ts">
import { Component } from 'vue-property-decorator'
import { ComponentBase } from '../../03designerLayoutBase'
import {
  Property,
  PropertyGroupName,
  Number_Property,
  Enum_Property,
  UploadFile_Property,
  Text_Property,
  Boolean_Property
} from '../../03designerLayoutBase'
import { param, paramType } from '../../03designerLayoutBase'
import { createDesigner } from './designer'
import { createViewer } from './viewer'
import './viewer-app.js'
import { simpleQueryAll } from '@/api/crud'

@Component({})
export default class ReportComponent extends ComponentBase {
  private reportDefault: string
  private reportSource: any
  private designer: any
  private viewer: any
  inparam: param[]
  outparam: param
  created() {
    //window.console.info('created')
  }

  reportFrameId: string = ''

  mounted() {
    this.width = 1200
    this.height = 800

    let datasetinparam: param[] = []
    datasetinparam.push({ name: '数据结构', type: paramType.complexType, val: null })
    this.registerMethods('新建报表', '', this.createReport, datasetinparam, null)

    let editinparam: param[] = []
    editinparam.push({ name: '报表id', type: paramType.string, val: null })
    this.registerMethods('编辑报表', '', this.editReport, editinparam, null)

    let viewinparam: param[] = []
    viewinparam.push({ name: '报表id', type: paramType.string, val: null })
    viewinparam.push({ name: '数据源', type: paramType.complexType, val: null })
    this.registerMethods('查看报表', '', this.viewReport, viewinparam, null)

    this.registerEvents('保存报表', '', this.inparam, this.outparam)

    let portalUrl = 'http://localhost:51980/'
    let username = 'admin'
    let password = 'admin'
    // var localJs = document.createElement("script");
    // localJs.setAttribute("src","./designer-app.js")
    // document.head.appendChild(localJs);
    //window.console.error('-----------------viewapp',viewapp)
    if (this.IsDesigning) {
      this.reportFrameId = this.Id
    } else {
      let parameter = { filter: [], modelCode: 'sys_param' }
      parameter.filter = [
        {
          code: 'param_name',
          value: 'REPORT_URL',
          type: 'EQ'
        }
      ]
      simpleQueryAll(parameter).then((res) => {
        if (res.data instanceof Array && res.data.length > 0) {
          portalUrl = res.data[0].param_value
        }
        window.console.error('-------------------portalUrl', portalUrl)
        ;(window as any).GrapeCity.ActiveReports.getReferenceToken(portalUrl, username, password).then((res) => {
          this.createApp(portalUrl, username, res)
          document.getElementById('wyn-designer-root').style.display = 'none'
          document.getElementById('wyn-viewer-root').style.display = 'none'
          let zindex = this.findPropertyByName(PropertyGroupName.normal, '层级设置')
          if (zindex) {
            this.setPropertyVal(zindex.id, 3)
          }
        })
      })
    }
    //window.console.error('-------------------------this.reportFrameId',this.reportFrameId)
  }

  createApp(portalUrl, username, referenceToken) {
    //const appSidebar = createAppSidebar(portalUrl, username, referenceToken)
    this.designer = createDesigner(portalUrl, referenceToken, this.saveReport)
    this.viewer = createViewer(portalUrl, referenceToken)
    //this.createReport()
  }

  /**遍历dom节点，添加data-v */
  setDatav(isview) {
    let root = document.getElementById('wyn-viewer-root')
    if (!isview) {
      root = document.getElementById('wyn-designer-root')
    }
    let dataV = root.attributes[0].name
    window.console.log('----------------dataV', dataV)
    let children = root.children
    window.console.log('----------------children', children)
    ;(children as any).forEach((element) => {
      element.setAttribute(dataV, '')
      if (element.children && element.children.length > 0) {
        this.recursive(element.children, dataV)
      }
    })
  }

  recursive(itemList, dataV) {
    if (itemList && itemList.length > 0) {
      itemList.forEach((element) => {
        element.setAttribute(dataV, '')
        if (element.children && element.children.length > 0) {
          this.recursive(element.children, dataV)
        }
      })
    }
  }

  /**function */
  /**新建报表
   * 需要支持一下动态参数
   * */
  createReport(param) {
    if (param instanceof Array && param.length > 0) {
      window.console.error('-----------------创建报表开始param', param)
      let inparam = {}
      for (let idx = 0; idx < param.length; idx++) {
        let source = param[idx].columns
        let dataset = []
        source.forEach((element) => {
          let field = { Name: element.code, DataField: element.code }
          dataset.push(field)
        })
        inparam['DataSet' + (idx + 1)] = dataset
      }
      this.designer.createReport(inparam)
      if (!this.IsDesigning) {
        document.getElementById('wyn-viewer-root').style.display = 'none'
        document.getElementById('wyn-designer-root').style.display = ''
      }
    }
  }

  /**
   * 编辑报表
   */
  editReport(param) {
    if (param instanceof Array && param.length > 0) {
      //window.console.error('-----------编辑报表入参',param)
      let report = { id: param[0] }
      if (!report.id) {
        return
      }
      this.designer.openReport(report)
      document.getElementById('wyn-viewer-root').style.display = 'none'
      document.getElementById('wyn-designer-root').style.display = ''
    }
  }

  /**
   * 查看报表
   */
  viewReport(param) {
    if (param instanceof Array && param.length > 0) {
      window.console.error('-----------查看报表入参', param)
      let reportId = param[0]
      if (!reportId) {
        return
      }
      let inparam = {}
      if (param.length > 1 && param[1]) {
        for (let idx = 1; idx < param.length; idx++) {
          let data = []
          data = param[idx].data ? (param[idx].data.content ? param[idx].data.content : param[idx].data) : param[1]
          if (data instanceof Array && data.length > 0) {
            data.forEach((element) => {
              Object.keys(element).forEach(function(index) {
                if (element[index] instanceof Object && element[index].itemName) {
                  element[index] = element[index].itemName
                }
              })
            })
          } else {
            data = []
          }
          inparam['DataSet' + idx] = data
        }
      }
      //let title = document.title
      //window.console.error('------------传参之前数据',data)
      //window.console.error('-----title-前',document.title)
      this.viewer.openReport(reportId, inparam)
      // setTimeout(() => {
      //     //document.title = title
      //     //window.console.error('-----title-后',document.title)
      // }, 1000);
      document.getElementById('wyn-designer-root').style.display = 'none'
      document.getElementById('wyn-viewer-root').style.display = ''
    }
  }

  /**
   * 删除报表
   */
  deleteReport(param) {}

  /**保存报表之后触发事件，用于数据传递 */
  saveReport(report) {
    //保存报表之后触发
    window.console.error('---------------------保存之后传递reportDef', report)
    this.triggeEvent('保存报表', report.id)
  }
}
</script>
<style lang="less" src="./viewer-app.less"></style>

<style lang="less" src="./designer-app.less">
</style>

<style lang="less" scoped>
/* @import './viewer-app.css';
@import './designer-app.css'; */

.wyn-designer {
  width: 100%;
  height: 100%;
  position: relative;
}

.wyn-viewer {
  width: 100%;
  height: 100%;
  position: relative;
}

// /deep/ .wd-app-container > .gc-grid > .gc-grid--designer {
//     -ms-grid-rows: auto auto minmax(0, 1fr) auto;
// }
</style>

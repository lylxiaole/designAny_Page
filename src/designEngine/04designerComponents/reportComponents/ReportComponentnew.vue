<template>
  <div class='container-parent' :style="{width:width+'px',height:(height)+'px'}">
    <div class="report-print-container" style="width:0px,height:0px" />
  </div>
</template>
<script lang="ts">
import { Component } from 'vue-property-decorator'
import ComponentBase from '../ComponentBase'
import {
  Property,
  PropertyGroupName,
  Number_Property,
  Enum_Property,
  UploadFile_Property,
  Text_Property,
  Boolean_Property,
  PropertyTypeEnum
} from '../../02common/commonClasses/LayoutProperty'
import common from '../../02common/commonMethod'
import modelAnalysis from '../../02common/impResourcesCache/modelAnalysis'
import { CurrentApis, CurrentContext, pagenNodeType, APIRequestClass, PageOrderClass } from '../../01designerContext'
import { param, paramType } from '../../02common/commonClasses/layoutEvent'
import { message } from 'ant-design-vue'
//import sleep from '../reportComponents/sleep'
declare var jsreports
import genoPrintDesigner from '../../genoPrintDesigner.vue'

enum reportType {
  design = 'design',
  designPreview = 'designPreview',
  print = 'print',
  printPreview = 'printPreview'
}
@Component({})
export default class ReportComponent extends ComponentBase {
  inparam: param[]
  outparam: param
  created() {
    //window.console.info('created')
  }
  mounted() {
    this.width = 200
    this.height = 100

    var p = new param()
    p.name = '模板样式内容'
    p.type = paramType.string
    this.RegisterEvents('设计器保存事件', '设计器保存事件', [p], this.outparam)

    //name: string  type: paramType  val: any
    var dataParam = new param()
    dataParam.name = '报表数据源'
    dataParam.type = paramType.complexType
    var tempParam = new param()
    tempParam.name = '报表模板内容'
    tempParam.type = paramType.string
    var schemaParam = new param()
    schemaParam.name = '数据源模型结构'
    schemaParam.type = paramType.string
    var tempAllParam = new param()
    tempAllParam.name = '报表模板'
    tempAllParam.type = paramType.complexType
    this.RegisterMethods('根据数据源结构设计', '根据数据源结构设计', this.designReportByDataSchema, [tempParam, schemaParam], null)
    this.RegisterMethods('根据数据源设计', '根据数据源设计', this.designReportByDataSource, [tempParam, dataParam], null)
    this.RegisterMethods('设计模板', '(根据数据或结构)设计模板', this.startPrintPopup, [tempAllParam, dataParam, schemaParam], null)
    this.RegisterMethods('打印预览', '打印预览', this.printPage, [tempParam, dataParam], null)
    this.RegisterMethods('打印报表', '打印报表', this.printPage, [tempParam, dataParam], null)
  }

  /**
   * 根据数据源结构设计模板
   */
  designReportByDataSchema(inparam) {
    //window.console.info(inparam)
    var template = inparam[0],
      dataSchema = inparam[1]
    var result = this.getSourceBySchema(dataSchema)
    if (result.error) {
      message.info(result.error)
      return
    }
    var report_def = this.getDesignReportDef(template)
    this.designReport(report_def, [result.value])
  }

  getSourceBySchema(dataSchema): any {
    var data_source = this.initReportSource()
    var schemaType = typeof dataSchema
    if (schemaType == 'string') {
      if (dataSchema.length == 0) {
        return { error: '数据源结构为空！' }
      }
      var result = this.jsonPrase(dataSchema)
      if (result.error) {
        return { error: '数据源结构不正确！\r\n正确结构应为：{ fields: [{name:"" type:""}] }\r\nerror：' + result.error }
      }
      dataSchema = result.value
      schemaType = typeof dataSchema
    }

    if (schemaType != 'object' && dataSchema.fields instanceof Array) {
      return { error: '数据源结构不正确！\r\n正确结构应为：{ fields: [{name:"" type:""}] }' }
    }
    data_source.schema = dataSchema //{ fields: [] }
    return { value: data_source }
  }

  designReportByAll(inparam) {
    //window.console.log('--------------------------打印设计', inparam)

    var template = inparam[0],
      data = inparam[1],
      schema = inparam[2]
    var dataResult = this.getReportSourceByData(data)
    var dataValue
    if (dataResult.value) {
      dataValue = dataResult.value
    } else {
      var schemaResult = this.getSourceBySchema(schema)
      if (schemaResult.error) {
        message.info(schemaResult.error + '\r\n且' + schemaResult.error)
        return
      }
      dataValue = schemaResult.value
    }
    var report_def = this.getDesignReportDef(template)
    this.designReport(report_def, [dataValue])
  }
  /**
   * 根据数据源设计模板
   */
  designReportByDataSource(inparam) {
    var template = inparam[0],
      data = inparam[1]
    var result = this.getReportSourceByData(data)
    if (result.error) {
      message.info(result.error)
      return
    }
    var report_def = this.getDesignReportDef(template)
    this.designReport(report_def, [result.value])
  }

  designReport(report_def, data_sources) {
    //window.console.info([report_def, data_sources])
    var designer = new jsreports.Designer({
      data_sources: data_sources,
      report_def: report_def,
      images: []
    })
    $('.jsr-designer-mask').css('z-index', '1000')
    var preview = designer.addToolbarButton('预览')
    $(preview).on('click', { func: this.reportPreview }, function(event) {
      //window.console.info(designer)
      if (!designer.data_sources[0].data) {
        message.info('没有数据源不能预览！')
        return
      }
      event.data.func(designer.report_def, data_sources)
    })

    designer.on('save', this.saveDesigner)
  }

  /**
   * 设计,或设计预览时的模板如果模板不正确，设置默认模板
   */
  getDesignReportDef(template) {
    var report_def
    if (template && template.length > 0) {
      var result = this.jsonPrase(template)
      if (result.value) {
        report_def = result.value
      }
    }

    if (!report_def) {
      report_def = jsreports
        .createReport()
        .data('data_sources')
        .detail(1)
        .done()
    }
    return report_def
  }

  /**
   * 打印模板，打印预览
   * 数据源和模板都不能error
   */
  previewReport(inparam) {
    var template = inparam[0],
      data = inparam[1]
    var result = this.checkPrintTemplateAndData(template, data)
    if (result.error) {
      message.info(result.error)
      return
    }

    this.reportPreview(result.report_def, result.datasets)
  }

  checkPrintTemplateAndData(template, data): any {
    var dataResult = this.getReportSourceByData(data)
    if (dataResult.error) {
      return { error: dataResult.error }
    }

    if (!template || template.length == 0) {
      return { error: '打印模板不能为空！' }
    }

    var tempResult = this.jsonPrase(template)
    if (tempResult.error) {
      return { error: '打印模板不正确！\r\nerror：' + tempResult.error }
    }
    return { report_def: tempResult.value, datasets: [dataResult.value] }
  }

  reportPreview(report_def, datasets) {
    var previewMask =
      '<div class="jsr-designer-mask jsr-preview-mask" style="opacity: 1;z-index:99999;display:flex; align-items: center; justify-content:center;" >' +
      '<div class="jsreports-designer jsr-style-root jsr-designer-popup" style="width: 700px; height: 850px;">' +
      '<div class="report-preview-container" style="width: 700px; height: 850px;"/></div></div>'
    $('body').append(previewMask)

    jsreports.render({
      report_def: report_def,
      target: $('.report-preview-container'),
      datasets: datasets
    })

    $('.jsr-preview-mask').click((e) => {
      if ($('.jsr-preview-mask').length > 0 && e.target == $('.jsr-preview-mask')[0]) {
        $('.jsr-preview-mask').remove()
      }
    })
    $('.jsr-content-viewport').css('background', 'white')
  }

  async printReport(inparam) {
    var loading = common.showLoading_Async()
    setTimeout(() => {
      common.closeLoading_Async(loading)
    }, 1000)
    var template = inparam[0],
      data = inparam[1]
    var result = this.checkPrintTemplateAndData(template, data)
    if (result.error) {
      message.info(result.error)
      return
    }
    //没有提供直接打印的方法，先预览，然后调用js执行打印
    jsreports.render({
      report_def: result.report_def,
      target: $('.report-print-container'),
      datasets: result.datasets
    })

    setTimeout(() => {
      $('a.jsr-export-print')[0].click()
      $('.report-print-container').empty()
    }, 300)

    await this.sleep(1000)
  }

  /**
   * 异步延迟
   * @param {number} time 延迟的时间,单位毫秒
   */
  sleep(time = 0) {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        resolve()
      }, time)
    })
  }

  getReportSourceByData(data): any {
    if (!data) {
      return { error: '数据源不能为空！' }
    }
    var source = this.initReportSource()
    if (data instanceof Array) {
      source.data = data
    } else if (data.content instanceof Array) {
      source.data = data.content
    } else if (data.data instanceof Array) {
      source.data = data.data
    } else {
      return { error: '数据源，或数据源的(content或data)属性必须是数组类型！' }
    }
    if (source.data.length == 0) {
      return { error: '数据源中没有数据！' }
    }

    return { value: source }
  }

  jsonPrase(json): any {
    try {
      var value = JSON.parse(json)
      return { value: value }
    } catch (error) {
      return { error: error }
    }
  }

  convertToStyle(content): any {
    if (content && content.length > 0) {
      try {
        var style = JSON.parse(content)
        if (typeof style == 'object') {
          return [style, '']
        }
      } catch (error) {
        return [null, '模板解析失败！']
      }
    }
    return [null, '']
  }

  /**其他函数************************************************************* */

  get modelCode(): string {
    var val = this.FindPropertyByName(PropertyGroupName.special, '模型编码')
    return val.value //uid_part_project
  }

  initReportSource(): any {
    var source = {
      id: 'data_sources',
      name: 'data_sources'
    }
    return source
  }

  saveDesigner(reportDef) {
    //window.console.info('保存样式', reportDef)
    var p = new param()
    p.name = '模板样式内容'
    p.type = paramType.string
    p.val = reportDef
    this.TriggeEvent('设计器保存事件', [p])
  }

  /**其他函数************************************************************* */
  private currentDesigner: genoPrintDesigner
  private startPrintPopup(inparam: any) {
    let templateId = inparam[0].data.id
    let templateContent = inparam[0].data['template_content']
    let data = inparam[1]
    let schema = inparam[2]
    //window.console.log('**********弹出打印控件了,传入参数是:', inparam)
     var tmpNode = window.document.createElement('div')
    var designer: genoPrintDesigner = new genoPrintDesigner()
    this.currentDesigner = designer
    var oldIsDesigning = this.IsDesigning
    var layerpopupIndex = (window as any).layer.open({
      type: 1,
      title: '打印',
      skin: 'popup-class',
      area: ['90%', '90%'],
      closeBtn: 1, //显示关闭按钮
      anim: 2,
      resize: false,
      shade: 0.6,
      shadeClose: false, //开启遮罩关闭
      zIndex: 100, //表格的tips是101，弹窗的zindex不能大于100 xuww 2020-04-02 add
      content: tmpNode,
      end: async () => {
        this.IsDesigning = oldIsDesigning
      },
      cancel: async () => {},
      success: function(layero, index) {}
    })
    this.IsDesigning = true
    this.currentDesigner.$mount(tmpNode)
    this.currentDesigner.StartPrint()
    let obj = common.deserialize(templateContent)
    //window.console.log('**********弹出打印控件了,传入参数是--------------------obj:', obj)
    if (!templateContent || obj instanceof Object) {
      let modelList: any[] = []
      modelList.push({ modelCode: schema.modelCode, isList: true })
      this.currentDesigner.NewPage(modelList)
    } else {
      this.currentDesigner.OpenPage(templateContent, data)
    }
    this.currentDesigner.$on('onSaved', (res) => {
      //window.console.log('--------------------保存返回值', res)
      //同步更新当前模板数据，把返回id更新到model_print_template里面
      this.updateContent(templateId, res)
    })
  }

  /**
   * 更新内容
   */
  private updateContent(id: any, content: any) {
    let param = {
      data: [
        {
          code: 'template_content',
          value: content
        }
      ],
      filter: [
        {
          code: 'id',
          type: 'EQ',
          value: id
        }
      ],
      modelCode: 'model_print_template'
    }
    CurrentApis.SimpleUpdate(param).then(() => {})
  }

  /**
   * 打印预览
   */
  private printPreview(inparam: any) {
    //window.console.log('**********弹出打印控件了,传入参数是:', inparam)
    let pageId = inparam[0]
    let obj = common.deserialize(pageId)
    //window.console.log('**********弹出打印控件了,传入参数是--------------------obj:', obj)
    if (obj instanceof Object) {
      //不支持旧版的设计内容
      this.$message.info('不支持旧版报表结构，请重新设计模板！')
      return
    }
    let data = inparam[1]
    var tmpNode = window.document.createElement('div')
    var designer: genoPrintDesigner = new genoPrintDesigner()
    this.currentDesigner = designer
    var oldIsDesigning = this.IsDesigning
    var layerpopupIndex = (window as any).layer.open({
      type: 1,
      title: '打印',
      skin: 'popup-class',
      area: ['90%', '90%'],
      closeBtn: 1, //显示关闭按钮
      anim: 2,
      resize: false,
      shade: 0.6,
      shadeClose: false, //开启遮罩关闭
      zIndex: 100, //表格的tips是101，弹窗的zindex不能大于100 xuww 2020-04-02 add
      content: tmpNode,
      end: async () => {
        this.IsDesigning = oldIsDesigning
      },
      cancel: async () => {},
      success: function(layero, index) {}
    })
    this.IsDesigning = true
    this.currentDesigner.$mount(tmpNode)
    this.currentDesigner.StartPrint()
    //let pageId = '98989070417920'
    this.currentDesigner.OpenPage(pageId, [data])
  }

  /**
   * 打印
   */
  private printPage(inparam: any) {
    let pageId = inparam[0]
    let data = inparam[1]
    //window.console.log('**********弹出打印控件了,传入参数是:', data)
   var tmpNode = window.document.createElement('div')
    var designer: genoPrintDesigner = new genoPrintDesigner()
    this.currentDesigner = designer
    var oldIsDesigning = this.IsDesigning
    var layerpopupIndex = (window as any).layer.open({
      type: 1,
      title: '打印',
      skin: 'popup-class',
      area: ['90%', '90%'],
      closeBtn: 1, //显示关闭按钮
      anim: 2,
      resize: false,
      shade: 0.6,
      shadeClose: false, //开启遮罩关闭
      zIndex: 100, //表格的tips是101，弹窗的zindex不能大于100 xuww 2020-04-02 add
      content: tmpNode,
      end: async () => {
        this.IsDesigning = oldIsDesigning
      },
      cancel: async () => {},
      success: function(layero, index) {}
    })
    this.IsDesigning = true
    this.currentDesigner.$mount(tmpNode)
    this.currentDesigner.StartPrint()
    //let pageId = '98989070417920'
    this.currentDesigner.PrintPage(pageId, [data], () => {
      this.currentDesigner.onClosePage(pageId)
      ;(window as any).layer.close(layerpopupIndex)
    })
  }
}
</script>
<style scoped>
</style>
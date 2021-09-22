<template>
  <div class='container-parent' :style="{width:width+'px',height:(height)+'px'}">
    <a-button type="primary" @click="showDesigner" :style="{display:designerBtnDisplay}">设计报表</a-button>
    <a-button type="primary" @click="preview" :style="{display:containPreview?'inline-block':'none'}">预览</a-button>
    <a-button type="primary" @click="print" :style="{display:containPrint?'inline-block':'none'}">打印</a-button>
    <div class="report-designer-container" :style="{width:width+'px',height:(height-35)+'px',display:designerDivDisplay}" />
    <div class="report-print-container" style="width:0px,height:0px" />
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
declare var jsreports

@Component({})
export default class CountDownComponent extends ComponentBase {
  private reportDefault: string
  private reportSource: any
  private designer: any
  inparam: param[]
  outparam: param
  private jsreports: any
  created() {
    //window.console.info('created')
  }
  mounted() {
    //window.console.info('mounted')
    this.reportDefault = jsreports
      .createReport()
      .data('data_sources')
      .detail(1)
      .done()

    this.reportSource = [
      {
        id: 'data_sources',
        name: 'data_sources',
        data: []
      }
    ]
    this.width = 700
    this.height = 600

    this.registerProperty('包含设计功能', PropertyGroupName.special, new Boolean_Property(), true)
    this.registerProperty('弹窗设计报表', PropertyGroupName.special, new Boolean_Property(), false)
    this.registerProperty('包含预览功能', PropertyGroupName.special, new Boolean_Property(), true)
    this.registerProperty('包含打印功能', PropertyGroupName.special, new Boolean_Property(), true)

    this.registerProperty('报表样式', PropertyGroupName.special, new Text_Property(), JSON.stringify(this.reportDefault), true)
    this.registerProperty('报表数据源', PropertyGroupName.special, new Text_Property(), JSON.stringify(this.reportSource), true)
    //this.registerProperty('报表图片', PropertyGroupName.special, new UploadFile_Property(10, 'image'))

    this.registerEvents('设计器保存事件', '', this.inparam, this.outparam)

    this.ObserverContainer()
  }

  get containPreview(): boolean {
    var result = false
    try {
      var val = this.findProperties(PropertyGroupName.special, '包含预览功能')[0]
      if (val && val.value) {
        result = val.value
      }
    } catch (ex) {
      //window.console.info('get containPreview error:', ex)
    }
    return result
  }

  get containPrint(): boolean {
    var result = false
    try {
      var val = this.findProperties(PropertyGroupName.special, '包含打印功能')[0]
      if (val && val.value) {
        result = val.value
      }
    } catch (ex) {
      //window.console.info('get containPrint error:', ex)
    }
    return result
  }

  get containDesign(): boolean {
    //window.console.info('get containDesign')
    var result = false
    try {
      var val = this.findProperties(PropertyGroupName.special, '包含设计功能')[0]
      if (val && val.value) {
        result = val.value
      }
    } catch (ex) {
      //window.console.info('get containDesign error:', ex)
    }
    return result
  }

  get designerInPopup(): boolean {
    var result = false
    try {
      var val = this.findProperties(PropertyGroupName.special, '弹窗设计报表')[0]
      if (val && val.value) {
        result = val.value
      }
    } catch (ex) {
      //window.console.info('get designerInPopo error:', ex)
    }
    //window.console.info('get designerInPopo:', result)
    return result
  }

  get designerDivDisplay(): any {
    //window.console.info('get designerDivDisplay')
    if (this.containDesign && this.designerInPopup) {
      return 'none'
    }
    return 'block'
  }

  get designerBtnDisplay(): any {
    //window.console.info('get designerBtnDisplay')
    if (this.containDesign) {
      if (this.designerInPopup) {
        return 'inline-block'
      } else {
        this.isInitReporting = true
        this.initReport(false)
        this.isInitReporting = false
      }
    } else {
      this.initReport(true)
    }
    return 'none'
  }

  get dataSources(): any {
    try {
      //window.console.info('get dataSources')
      var val = this.findProperties(PropertyGroupName.special, '报表数据源')[0]
      if (val && val.value) {
        // window.console.info('获取报表数据源:', JSON.parse(val.value))
        var obj = JSON.parse(val.value)
        if (typeof obj == 'object' && obj instanceof Array) {
          // window.console.info('获取数据源：', obj)
          return obj
        }
      }
    } catch (ex) {
      //window.console.info('get dataSources error:', ex)
    }
    var result = [
      {
        id: 'data_sources',
        name: 'data_sources',
        data: []
      }
    ]
    //window.console.info('默认数据源：', result)
    return result
  }

  get reportDef(): any {
    try {
      //window.console.info('get reportDef')
      var val = this.findProperties(PropertyGroupName.special, '报表样式')[0]
      if (val && val.value) {
        //window.console.info('获取报表样式 :', val.value)
        var obj = JSON.parse(val.value)
        //window.console.info('obj', obj)
        if (typeof obj == 'object') {
          return obj
        }
      }
    } catch (ex) {
      //window.console.info('get reportDef error:', ex)
    }
    //window.console.info('默认样式', JSON.stringify(this.reportDefault))
    return this.reportDefault
  }

  showDesigner() {
    //window.console.info('报表初始化')
    this.designer = new jsreports.Designer({
      data_sources: this.dataSources,
      report_def: this.reportDef,
      images: [] //this.reportImages,
      //showDownloadButton: true,
    })
    $('.jsr-designer-mask').css('z-index', '1000')
    this.designer.on('save', this.saveDesigner)
    //console.info($('.jsreports-designer'))
  }

  preview() {
    var previewMask =
      '<div class="jsr-designer-mask" style="opacity: 1;z-index:99999;display:flex; align-items: center; justify-content:center;" >' +
      '<div class="jsreports-designer jsr-style-root jsr-designer-popup" style="width: 700px; height: 850px;">' +
      '<div class="report-preview-container" style="width: 700px; height: 850px;"/></div></div>'
    $('body').append(previewMask)

    //window.console.info($('.report-preview-container'))

    var report_instance = jsreports.render({
      embedded: false,
      report_def: this.reportDef,
      target: $('.report-preview-container'),
      datasets: this.dataSources
    })
    $('.jsr-designer-mask').click((e) => {
      if ($('.jsr-designer-mask').length > 0 && e.target == $('.jsr-designer-mask')[0]) {
        $('.jsr-designer-mask').remove()
      }
    })
    $('.jsr-content-viewport').css('background', 'white')
    //console.info('report_instance:', report_instance)
    //console.info('jsreports:', jsreports)
  }

  print() {
    try {
      jsreports.render({
        report_def: this.reportDef,
        target: $('.report-print-container'),
        datasets: this.dataSources
      })
      setTimeout(() => {
        $('a.jsr-export-print')[0].click()
        $('.report-print-container').empty()
      }, 100)
    } catch (ex) {
      //window.console.info(ex)
    }
  }

  ObserverContainer() {
    var observe = new MutationObserver(this.mutationCallback)
    var container = $('.report-designer-container').last()
    let config = {
      attributes: true //目标节点的属性变化
      //childList: true, //目标节点的子节点的新增和删除
      //characterData: true, //如果目标节点为characterData节点(一种抽象接口,具体可以为文本节点,注释节点,以及处理指令节点)时,也要观察该节点的文本内容是否发生变化
      //subtree: true, //目标节点所有后代节点的attributes、childList、characterData变化
    }
    //console.info('container', container)
    //console.info(container[0])
    observe.observe(container[0], config)
  }

  private oldStyle: string
  private isInitReporting: boolean
  mutationCallback(mutationsList) {
    //window.console.info('containDesign:', this.containDesign, 'isInitReporting:', this.isInitReporting)
    if (!this.containDesign || this.isInitReporting) {
      return
    }
    for (let mutation of mutationsList) {
      let type = mutation.type
      switch (type) {
        case 'childList':
          //console.log('A child node has been added or removed.')
          break
        case 'attributes':
          if (mutation.attributeName == 'style') {
            var newStyle = mutation.target.attributes['style'].value
            //window.console.log(`The ${mutation} :`, newStyle)
            if (this.oldStyle != newStyle) {
              this.oldStyle = newStyle
              this.initReport(this.designerInPopup)
            }
          }
          break
        case 'subtree':
          //console.log(`The subtree was modified.`)
          break
        default:
          break
      }
    }
  }

  initReport(designerInPopup) {
    var container = $('.report-designer-container').last()
    container.empty()
    if (designerInPopup) {
      return
    }
    //window.console.info('报表初始化')
    this.designer = new jsreports.Designer({
      embedded: true,
      container: container,
      data_sources: this.dataSources,
      report_def: this.reportDef,
      images: [] //this.reportImages,
    })
    this.designer.on('save', this.saveDesigner)
    //console.info($('.jsreports-designer'))
  }

  saveDesigner(reportDef) {
    //window.console.info('保存')
    this.reportDefault = reportDef
    var pro = this.findPropertyByName(PropertyGroupName.special, '报表样式')
    this.setPropertyVal(pro.id, reportDef)
    //window.console.info('保存样式', JSON.stringify(this.reportDefault))
    this.triggeEvent('设计器保存事件', [reportDef])
  }
}
</script>
<style scoped>
</style>
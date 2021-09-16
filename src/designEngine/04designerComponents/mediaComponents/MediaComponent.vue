/** 
多媒体组件 支持视频，pdf，office展示 
添加对于图片和txt的支持
添加对于多sheet xls的支持
xuww add 2019-09-18
*/
<template>
  <div :id="Id" style="overflow:auto;margin:0 auto;" @dblclick="onclick" :style="{background:backgroundColor}">
    <a-row style="width:100%;height:100%">
      <!-- <a-col style="border: 2px solid skyblue; height:10%;">
        <span>{{FilePath}}</span>
      </a-col> -->
      <!-- <div style="height:0px;overflow:hidden">{{FilePath}}</div> -->
      <div class="videoDemo" v-show="fileType==='video'">
        <video-player class="vjs-custom-skin" ref="videoPlayer"
          :options="{'height':'400','width':'400','autoplay': false,'muted': true,'language': 'en','playbackRates': [0.7, 1.0, 1.5, 2.0],'sources':videoSource}"
          :playsinline="true" @play="onPlayerPlay($event)" @pause="onPlayerPause($event)" @ended="onPlayerEnded($event)"
          @loadeddata="onPlayerLoadeddata($event)" @waiting="onPlayerWaiting($event)" @playing="onPlayerPlaying($event)"
          @timeupdate="onPlayerTimeupdate($event)" @canplay="onPlayerCanplay($event)" @canplaythrough="onPlayerCanplaythrough($event)"
          @ready="playerReadied" @statechanged="playerStateChanged($event)">
        </video-player>
      </div>
      <div class="pdfDemo" id="pdfDemo" v-show="fileType==='pdf'">
        <!-- <canvas id="the-canvas" class="pdfDemo"></canvas> -->
        <canvas v-for="(page,index) in pages" :id="'canvas' + page" :key="index"></canvas>
      </div>
      <div id="demo" v-show="fileType==='office'" class="officeDemo"></div>
      <div v-show="fileType==='xlsx'" class="excelDemo">
        <div id="excel" style="overflow-x:auto;width:100%;height:100%" v-html="currentsheetContent"></div>
        <a-radio-group style="margin-top:8px" @change="radioChange" v-model="defaultValue">
          <a-radio-button v-for="item in sheets" :key="item.sheetName" :value="item.sheetName">{{item.sheetName}}</a-radio-button>
        </a-radio-group>
      </div>
      <!-- <a-tabs ref="tabs" v-show="fileType==='xlsx'">
        <a-tab-pane v-for="sheet in sheets" :key="sheet.sheetName" :tab="sheet.sheetName">
          <div v-html="sheet.sheetContent"></div>
        </a-tab-pane>
      </a-tabs> -->
      <div style="margin:0 auto;text-align: center;">
        <img id="image" v-show="fileType==='image'" class="imageDemo" />
      </div>      
    </a-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'

import {
  Property,
  Text_Property,
  Behavior_Property,
  Enum_Property,
  PropertyGroupName,
  UploadFile_Property
} from '../../02common/commonClasses/LayoutProperty'

import ComponentBase from '../ComponentBase'
import fileUpload from '../../02common/uploadFile/fileUpload'
import { CurrentContext } from '../../01designerContext'
import pdfjsLib from 'pdfjs-dist/build/pdf'
import mammoth from 'mammoth'
import XLSX from 'xlsx'
import common from '../../02common/commonMethod'

import MediaModal from "../../04designerComponents/mediaComponents/MediaModal.vue";

//var url = 'http://172.16.50.87:30040/fileservice/bucket-default/2019-09-20/SOP-TY-008三防（A1）.pdf?versionId=2y-tBAB4VIlHhmIE1zfQmyZhRlvnkzp'

pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/build/pdf.worker.js'

@Component
export default class MediaComponent extends ComponentBase {
  get backgroundColor(): string {
    if (this.FindPropertyByName(PropertyGroupName.normal, '背景色')) {
      return this.FindPropertyByName(PropertyGroupName.normal, '背景色').value as string
    } else {
      return null
    }
  }  

  fileType: string = 'image'
  // get fileType(): string {
  //   let typeName = ''
  //   return typeName
  // }

  // set fileType(typeName: string) {

  // }

  videoSource: any = [
    {
      type: 'video/mp4',
      src: ''
    }
  ]
  // get videoSource(): any {
  //   return [
  //     {
  //       type: 'video/mp4',
  //       src: this.FilePath,
  //     },
  //   ]
  // }
  //_filePath: string

  get FilePath(): string {
    //window.console.log('CurrentContext111', CurrentContext)
    let property = this.FindPropertyByName(PropertyGroupName.special, '文件路径')
    if (this.FindProperties(PropertyGroupName.special, '选择文件')[0]) {
      let selectValues = this.FindProperties(PropertyGroupName.special, '选择文件')[0].value
      if (selectValues instanceof Array) {
        return ''
      }
      if (selectValues && selectValues.length > 0) {
        let shortPath = selectValues
        let end = shortPath.indexOf('?versionId')
        let start = shortPath.lastIndexOf('.')
        let typeName = shortPath.substring(start, end).replace('.', '')
        //window.console.log('typeName', typeName)
        let fullpath = selectValues
        if (selectValues.indexOf(CurrentContext.BusinessFileServerAddress) < 0) {
          fullpath = common.BuildingFileUrlForShow(CurrentContext.BusinessFileServerAddress, selectValues)
        }        
        //window.console.log('fullpath', fullpath)
        //this._filePath = fullpath
        this.refresh(fullpath, typeName)
        return fullpath
      }
      return ''
    } else {
      return ''
    }
  }

  set FilePath(value: string) {
    //console.log('CurrentContext', CurrentContext)
    let shortPath = value.replace(CurrentContext.BusinessFileServerAddress, '')
    //console.log('shortPath', shortPath)
    shortPath = shortPath.split('?versionId')[0]
    let end = shortPath.length
    let start = shortPath.lastIndexOf('.')
    let typeName = shortPath.substring(start, end).replace('.', '')
    if (value.indexOf(CurrentContext.BusinessFileServerAddress) < 0) {
      value = common.BuildingFileUrlForShow(CurrentContext.BusinessFileServerAddress, value)
    }
    this.refresh(value, typeName)
  }

  private refresh(fullpath: string, typeName: string) {
    window.console.log('fullpath', fullpath)
    let start = typeName.lastIndexOf('.')
    if (start > -1) {
      typeName = typeName.substring(start + 1, typeName.length)
    }
    if (typeName.length > 0) {
      typeName = typeName.toLowerCase()
    }
    switch (typeName) {
      case 'mp4':
        this.fileType = 'video'
        this.videoSource = [
          {
            type: 'video/mp4',
            src: common.clone(fullpath)
          }
        ]
        var ddd = this.bodyContent.getElementsByClassName('videoDemo')
        if (ddd.length === 1) {
          ;(ddd[0] as any).style.display = ''
        } else {
          ;(ddd[0] as any).style.display = ''
          ;(ddd[1] as any).style.display = ''
        }
        break
      case 'pdf':
        this.fileType = 'pdf'
        var ddd = this.bodyContent.getElementsByClassName('pdfDemo')
        if (ddd.length === 1) {
          ;(ddd[0] as any).style.display = ''
        } else {
          ;(ddd[0] as any).style.display = ''
          ;(ddd[1] as any).style.display = ''
        }
        this.refreshPdf(fullpath)
        break
      case 'doc':
      case 'docx':
      case 'txt':
      case 'xml':
      case 'log':
        this.fileType = 'office'
        this.refreshOffice(fullpath, typeName)
        break
      case 'xls':
      case 'xlsx':
      case 'csv':
        //this.fileType = 'xlsx'
        //this.sheets = [{sheetName:'11',sheetContent:'22'},{sheetName:'33',sheetContent:'44'}]
        this.refreshOffice(fullpath, typeName)
        break
      case 'jpg':
      case 'png':
      case 'gif':
      case 'bmp':
      case 'jpeg':
        this.fileType = 'image'
        var ddd = this.bodyContent.getElementsByClassName('imageDemo')
        if (ddd.length === 1) {
          ;(ddd[0] as any).src = fullpath
          ;(ddd[0] as any).style.display = ''
        } else {
          ;(ddd[0] as any).src = fullpath
          ;(ddd[1] as any).src = fullpath
          ;(ddd[0] as any).style.display = ''
          ;(ddd[1] as any).style.display = ''
        }
        break
      default:
        break
    }
  }

  pages: any = [1]
  canvas: any[] = []

  private refreshPdf(filePath: string) {
    var loadingTask = pdfjsLib.getDocument(filePath)
    loadingTask.promise.then((pdf) => {
      //var pageNumber = 1
      //this.pages = pdf.numPages
      for (var idx = 1; idx <= pdf.numPages; idx++) {
        this.pages.push(idx)
      }
      //window.console.log('--------pages', this.pages)
      var ddd = this.bodyContent.getElementsByClassName('pdfDemo')
      this.canvas = this.bodyContent.getElementsByTagName('canvas')
      //window.console.log('------------------------多媒体组件canvas', this.canvas)
      if (ddd.length === 1) {
        //canvas = ddd[0] as any
        this.getPage(pdf, 1, pdf.numPages)
      } else {
        let aaa = []
        aaa.push(ddd[0] as any)
        aaa.push(ddd[1] as any)
        this.getPage(pdf, 1, pdf.numPages)
      }
    })
  }

  private getPage(pdf, pageNumber, numPages) {
    let _this = this
    pdf.getPage(pageNumber).then((page) => {
      // 获取DOM中为预览PDF准备好的canvasDOM对象
      //var ddd = _this.bodyContent.getElementById('pdfDemo').childNodes as any
      //window.console.log('--------ddd', ddd)
      var canvas = _this.canvas[pageNumber - 1]
      var scale = 1.5
      var viewport = page.getViewport({ scale: scale })
      var context = canvas.getContext('2d')
      canvas.height = viewport.height
      canvas.width = viewport.width
      var renderContext = {
        canvasContext: context,
        viewport: viewport
      }
      page.render(renderContext).then(() => {
        pageNumber += 1
        if (pageNumber <= numPages) {
          _this.getPage(pdf, pageNumber, numPages)
        }
      })
    })
  }

  private refreshOffice(filePath: string, fileType: string) {
    //let isdoc = fileType === 'doc' || fileType === 'docx' || fileType === 'txt' ? true : false
    let that = this
    //that.fileType = 'xlsx'
    //that.sheets = [{ sheetName: '11', sheetContent: '22' }, { sheetName: '33', sheetContent: '44' }]
    // that.fileType = 'xlsx'
    // that.sheets = [{ sheetName: '11', sheetContent: '22' }]
    fetch(filePath).then(function(response) {
      //that.sheets = [{ sheetName: '11', sheetContent: '22' }, { sheetName: '33', sheetContent: '44' }]
      //that.$refs.tabs.createNewTab('11')
      //console.log('that', that.$refs.tabs)
      response.blob().then(function(tempdata: Blob) {
        //   console.log('tempdata', tempdata)
        let metadata = {
          type: 'application/octet-stream'
        }
        //let data = null
        let file = new File([tempdata], 'test', metadata)
        // ... do something with the file or return it
        var reader = new FileReader()
        switch (fileType) {
          case 'doc':
          case 'docx':
            reader.onloadend = function(event) {
              var arrayBuffer = reader.result
              //window.console.log('arrayBuffer', arrayBuffer)
              mammoth.convertToHtml({ arrayBuffer: arrayBuffer }).then(function(resultObject: any) {
                //document.getElementById('demo').innerHTML = resultObject.value
                //filePath
                //window.console.log('-----------------filePath', filePath)
                //window.console.log('-----------------resultObject', resultObject)
                var ddd = that.bodyContent.getElementsByClassName('officeDemo')
                if (ddd.length === 1) {
                  ddd[0].innerHTML = resultObject.value
                  ;(ddd[0] as any).style.display = ''
                } else {
                  ddd[0].innerHTML = resultObject.value
                  ddd[1].innerHTML = ddd[0].innerHTML
                  ;(ddd[0] as any).style.display = ''
                  ;(ddd[1] as any).style.display = ''
                }
                //window.console.log('-----------------ddd', ddd)
                //window.console.log('-----------------demo', that.bodyContent.getElementById('demo'))
              })
            }
            reader.readAsArrayBuffer(file)
            break
          case 'xls':
          case 'xlsx':
          case 'csv':
            reader.onload = function(event: any) {
              var binary = ''
              var bytes = new Uint8Array(event.target.result)
              var length = bytes.byteLength
              for (var i = 0; i < length; i++) {
                binary += String.fromCharCode(bytes[i])
              }
              // call 'xlsx' to read the file
              var oFile = XLSX.read(binary, { type: 'binary', cellDates: true, cellStyles: true })
              //window.console.log('oFile', oFile)
              that.readWorkbook(oFile)
              that.fileType = 'xlsx'
              let ddd = that.bodyContent.getElementsByClassName('excelDemo')
              if (ddd.length === 1) {
                ;(ddd[0] as any).style.display = ''
              } else {
                ;(ddd[0] as any).style.display = ''
                ;(ddd[1] as any).style.display = ''
              }
            }
            reader.readAsArrayBuffer(file)
            break
          case 'txt':
          case 'log':
            reader.onload = function(event) {
              var ddd = that.bodyContent.getElementsByClassName('officeDemo')
              if (ddd.length === 1) {
                ddd[0].innerHTML = reader.result as string
                ;(ddd[0] as any).style.display = ''
              } else {
                ddd[0].innerHTML = reader.result as string
                ddd[1].innerHTML = reader.result as string
                ;(ddd[0] as any).style.display = ''
                ;(ddd[1] as any).style.display = ''
              }
              //document.getElementById('demo').innerHTML = reader.result as string
            }
            reader.readAsText(file, 'gb2312')
            break
          case 'xml':
            reader.onload = function(event) {
              that.bodyContent.getElementsByClassName('officeDemo').innerHTML = reader.result as string
            }
            reader.readAsText(file, 'gb2312')
            break
          default:
            break
        }
      })
    })
  }

  defaultValue: string = ''
  sheets: any[] = [{ sheetName: '', sheetContent: '' }]
  currentsheetContent: string = ''
  private readWorkbook(workbook: any) {
    var sheetNames = workbook.SheetNames // 工作表名称集合
    this.sheets = []
    let idx = 0
    sheetNames.forEach((element) => {
      var worksheet = workbook.Sheets[element] // 这里我们只读取第一张sheet
      //var csv = XLSX.utils.sheet_to_csv(worksheet)
      //var json = XLSX.utils.sheet_to_json(worksheet)
      var html = XLSX.utils.sheet_to_html(worksheet)
      //window.console.log('-------------------xls显示内容csv', csv)
      //window.console.log('-------------------xls显示内容json', json)
      //window.console.log('-------------------xls显示内容html', html)
      //let sheetContent = this.csv2table(csv)
      //window.console.log('-------------------xls显示内容', sheetContent)
      if (idx === 0) {
        this.currentsheetContent = html
      }
      this.sheets.push({ sheetName: element, sheetContent: html })
      idx++
    })
    this.defaultValue = sheetNames[0]
    //console.log('this.defaultValue', this.defaultValue)
    //console.log('this.sheets', this.sheets)
    //console.log('this.sheets', this.sheets)
  }

  // 将csv转换成简单的表格，会忽略单元格合并，在第一行和第一列追加类似excel的索引
  private csv2table(csv: any) {
    var html = '<table>'
    var rows = csv.split('\n')
    rows.pop() // 最后一行没用的
    rows.forEach(function(row: any, idx: any) {
      var columns = row.split(',')
      columns.unshift(idx + 1) // 添加行索引
      if (idx == 0) {
        // 添加列索引
        html += '<tr>'
        for (var i = 0; i < columns.length; i++) {
          html += '<th>' + (i == 0 ? '' : String.fromCharCode(65 + i - 1)) + '</th>'
        }
        html += '</tr>'
      }
      html += '<tr>'
      columns.forEach(function(column: any) {
        html += '<td>' + column + '</td>'
      })
      html += '</tr>'
    })
    html += '</table>'
    return html
  }

  /** json转table */
  private json2table(json: any, csv: any) {
    var html = '<table>'
    var header = csv.split('\n')[0]
    var columns = header.split(',')
    var rows = json
    rows.pop() // 最后一行没用的
    rows.forEach(function(row: any, idx: any) {
      //var columns = row.split(',')
      columns.unshift(idx + 1) // 添加行索引
      if (idx == 0) {
        // 添加列索引
        html += '<tr>'
        for (var i = 0; i < columns.length; i++) {
          html += '<th>' + (i == 0 ? '' : String.fromCharCode(65 + i - 1)) + '</th>'
        }
        html += '</tr>'
      }
      html += '<tr>'
      columns.forEach(function(column: any) {
        html += '<td>' + row[column] + '</td>'
      })
      html += '</tr>'
    })
    html += '</table>'
    return html
  }
  bodyContent: any
  //fileUploadClass: fileUpload = null
  mounted() {
    this.width = 400
    this.height = 400
    //注册属性
    //文件选择框
    //this.RegisterProperty('选择文件', PropertyGroupName.special, new UploadFile_Property(1, ''))
    this.RegisterProperty('文件路径', PropertyGroupName.special, new Text_Property(), null)
    //this.fileUploadClass = new fileUpload(CurrentContext.FileServerAddress)
    //是否需要根据文件类型来判断显示属性

    //视频是否支持循环播放
    this.$on('onPropertyChanged', this.onPropertyChangedInner)
    //window.console.log('------------------------多媒体组件id', document.getElementById(this.Id))
    this.bodyContent = $(this.$el)[0]    
  }

  onclick(){
    //console.log("this is dblclick event");
    if (this.IsDesigning) {
      return
    }
    //弹窗
    //MediaComponent
    let domid = common.getUuid()
    var div = $(this.$el)[0].innerHTML
    let tmpNode = ' <div id="' + domid + '"> </div> '
    //window.console.log('----------div',div)
    window.console.log('----------tmpNode',tmpNode)
    var layerpopupIndex = (window as any).layer.open({
      type: 1,
      title: '查看',
      skin: 'popup-class',
      area: ['100%', '100%'],
      closeBtn: 1, //显示关闭按钮
      anim: 2,
      resize: false,
      shade: 0.6,
      shadeClose: false, //开启遮罩关闭
      zIndex: 100, //表格的tips是101，弹窗的zindex不能大于100 xuww 2020-04-02 add
      content: (this.fileType == 'pdf' || this.fileType == 'xlsx')?tmpNode:div,
      end: async () => {
        //this.IsDesigning = oldIsDesigning
      },
      cancel: async () => {},
      success: function(layero, index) {}
    })
    //excel文件有点击操作，也需要单独加载
    if (this.fileType == 'pdf' || this.fileType == 'xlsx'){
      //不能直接把网页传递进去了，canvas加载不出来
      let modal = new MediaModal()
      let property = this.FindPropertyByName(PropertyGroupName.special, '文件路径')
      let fullpath = property.value
      if (fullpath.indexOf(CurrentContext.BusinessFileServerAddress) < 0) {
        fullpath = common.BuildingFileUrlForShow(CurrentContext.BusinessFileServerAddress, fullpath)
      }
      //fullpath += '?Company-Id=999'
      //let fullpath = common.BuildingFileUrlForShow(CurrentContext.BusinessFileServerAddress, property.value)      
      modal.fileType = this.fileType
      modal.filePathTemp = fullpath
      //window.console.log('-------------modal',modal)
      modal.$mount('#' + domid)
    }    
  }

  protected loadCompleted(childrenData: any[]) {
    if (this.FindPropertyByName(PropertyGroupName.special, '文件路径')) {
      let property = this.FindPropertyByName(PropertyGroupName.special, '文件路径')
      //window.console.log('--------------------------文件路径-----------------------------------', property)
      if (property.value) {
        this.resetComp()
        this.FilePath = property.value
        //属性变更之后要把组件隐藏起来
        this.videoSource = [
          {
            type: 'video/mp4',
            src: common.clone(property.value)
          }
        ]
      }
    }
  }

  protected onPropertyChangedInner(propertyId: string, property: Property, layout: ComponentBase): void {
    switch (property.propertyName) {
      case '文件路径':
        //window.console.log('----------------------------------文件路径变化', property)
        this.resetComp()
        this.FilePath = property.value
        break
    }
  }

  /** 重置组件 */
  resetComp() {
    window.console.log('-------------$(this.$el)', $(this.$el))
    if (!this.bodyContent) {
      this.bodyContent = $(this.$el)[0]
    }
    window.console.log('-------------this.bodyContent', this.bodyContent)
    var ddd = this.bodyContent.getElementsByClassName('imageDemo')
    if (ddd.length === 1) {
      ;(ddd[0] as any).style.display = 'none'
    } else {
      ;(ddd[0] as any).style.display = 'none'
      ;(ddd[1] as any).style.display = 'none'
    }
    ddd = this.bodyContent.getElementsByClassName('officeDemo')
    if (ddd.length === 1) {
      ;(ddd[0] as any).style.display = 'none'
    } else {
      ;(ddd[0] as any).style.display = 'none'
      ;(ddd[1] as any).style.display = 'none'
    }
    ddd = this.bodyContent.getElementsByClassName('videoDemo')
    if (ddd.length === 1) {
      ;(ddd[0] as any).style.display = 'none'
    } else {
      ;(ddd[0] as any).style.display = 'none'
      ;(ddd[1] as any).style.display = 'none'
    }
    ddd = this.bodyContent.getElementsByClassName('excelDemo')
    if (ddd.length === 1) {
      ;(ddd[0] as any).style.display = 'none'
    } else {
      ;(ddd[0] as any).style.display = 'none'
      ;(ddd[1] as any).style.display = 'none'
    }
    ddd = this.bodyContent.getElementsByClassName('pdfDemo')
    if (ddd.length === 1) {
      ;(ddd[0] as any).style.display = 'none'
      ;(ddd[0] as any).innerHTML = ''
    } else {
      ;(ddd[0] as any).style.display = 'none'
      ;(ddd[1] as any).style.display = 'none'
      ;(ddd[0] as any).innerHTML = ''
      ;(ddd[1] as any).innerHTML = ''
    }
  }

  // listen event
  onPlayerPlay(player: any) {
    //window.console.log('player play!', player)
  }
  onPlayerPause(player: any) {
    // console.log('player pause!', player)
  }
  onPlayerEnded(player: any) {
    // console.log('player ended!', player)
  }
  onPlayerLoadeddata(player: any) {
    // console.log('player Loadeddata!', player)
  }
  onPlayerWaiting(player: any) {
    // console.log('player Waiting!', player)
  }
  onPlayerPlaying(player: any) {
    // console.log('player Playing!', player)
  }
  onPlayerTimeupdate(player: any) {
    // console.log('player Timeupdate!', player.currentTime())
  }
  onPlayerCanplay(player: any) {
    // console.log('player Canplay!', player)
  }
  onPlayerCanplaythrough(player: any) {
    // console.log('player Canplaythrough!', player)
  }

  // or listen state event
  playerStateChanged(playerCurrentState: any) {
    // console.log('player current update state', playerCurrentState)
  }

  // player is ready
  playerReadied(player: any) {
    // seek to 10s
    //window.console.log('example player 1 readied', player)
    player.currentTime(10)
    // console.log('example 01: the player is readied', player)
  }

  radioChange(event: any) {
    //console.log('event', event)
    this.sheets.forEach((element) => {
      if (element.sheetName === event.target.value) {
        this.currentsheetContent = element.sheetContent
        //console.log('this.currentsheetContent',this.currentsheetContent)
        return
      }
    })
    //this.$refs.radioGroup
    //this.defaultValue = event.target.value
    //console.log('this.$refs.radioGroup', this.defaultValue)
  }
}
</script>

<style lang="less" scoped>
/deep/ table {
  border-collapse: collapse;
  color: #6d6d6d;
}
/deep/ th,
/deep/ td {
  border: solid 1px #6d6d6d;
  padding: 5px 10px;
  color: #6d6d6d;
}
</style>
<template>
  <div style="overflow:auto;margin:0 auto;">
    <a-row style="width:100%;height:800px">
      <div v-show="fileType==='pdf'" class="pdfDemo" id="pdfDemo" style="margin-left: 250px;">
        <canvas v-for="(page, index) in pages" :id="'canvas' + page" :key="index"></canvas>
      </div>
      <div v-show="fileType==='xlsx'" class="excelDemo">
        <div id="excel" style="overflow-x:auto;width:100%;height:100%" v-html="currentsheetContent"></div>
        <a-radio-group style="margin-top:8px" @change="radioChange" v-model="defaultValue">
          <a-radio-button v-for="item in sheets" :key="item.sheetName" :value="item.sheetName">{{item.sheetName}}</a-radio-button>
        </a-radio-group>
      </div>
    </a-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import LayoutBase, { LayoutType, LayoutInfo } from '../../03designerLayoutBase/LayoutBase'
import PageBase from '../../03designerLayoutBase/PageBase'
import common from '../../02common/commonMethod'
import CompIncrustationPro from '../../05designerLayouts/layout_Professional/CompIncrustationPro.vue'
import { AllComponents, ComponentBase } from '../../04designerComponents'
import { CurrentApis, pagenNodeType, CurrentContext } from '../../01designerContext'
import { DragItemData, DragItemTypeEnum } from '../../03designerLayoutBase/BaseEvents'
import { Property, PropertyGroupName } from '../../02common/commonClasses/LayoutProperty'
import { param } from '../../02common/commonClasses/layoutEvent'
import pdfjsLib from 'pdfjs-dist/build/pdf'
import XLSX from 'xlsx'

pdfjsLib.GlobalWorkerOptions.workerSrc = 'pdfjs-dist/build/pdf.worker.js'

@Component
export default class MediaModal extends PageBase {
  //父页面
  //public parentPage: PageBase;

  //public currentRow: any;

  pages: any = [1]
  canvas: any[] = []

  inparam: param[]
  outparam: param

  @Prop()
  fileType: string = 'pdf'

  @Prop()
  filePathTemp: any
  //='http://192.168.1.18:30041/businessfileservice/999-genoany-business/2020-11-09%2Fb70cedc614b54f369c23c6ca7214568d%2F1%E6%9C%8811%E4%BC%98%E5%80%8D%E7%94%B5%E6%B0%94%E5%B9%B4%E4%BC%9A%E5%BA%A7%E4%BD%8D%E7%A4%BA%E6%84%8F%E5%9B%BE.pdf?Access-Token=eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOlsiRGVzaWduV2ViIl0sInJlZnJlc2hfdG9rZW4iOiIiLCJzdWIiOiIxODMwMjEyMzI3MCIsInVzZXJfbmFtZSI6IjE4MzAyMTIzMjcwIiwic2NvcGUiOm51bGwsImVudGVycHJpc2VfaWQiOiIxMjA1NjQwNTQ0MjU2MDAiLCJleHAiOjE2MDQ5MTMyODAsImlhdCI6MTYwNDkwOTY4MCwiYXV0aG9yaXRpZXMiOm51bGwsImNsaWVudF9pZCI6IkRlc2lnbldlYiIsImp0aSI6ImZhMGY4NjE5LTU4MzctNDkxYi1iNWU4LWYxMzBhMmRlNWMxYiJ9.EUFgdXL8VLRRFHfCyPgszriz5ERMUcpB1oT1BkEJUBI&&Company-Id=999'

  defaultValue: string = ''
  sheets: any[] = [{ sheetName: '', sheetContent: '' }]
  currentsheetContent: string = ''

  private refreshPdf(filePath: string) {
    var loadingTask = pdfjsLib.getDocument(filePath)
    loadingTask.promise.then((pdf) => {
      //var pageNumber = 1
      //this.pages = pdf.numPages
      for (var idx = 1; idx <= pdf.numPages; idx++) {
        this.pages.push(idx)
      }
      //window.console.log('--------pages', this.pages)
      var ddd = $(this.$el)[0].getElementsByClassName('pdfDemo')
      this.canvas = ($(this.$el)[0] as any).getElementsByTagName('canvas')
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

  private domCache: DocumentFragment = null
  //页面中包含的布局容器
  public PageComponentIncrustations: CompIncrustationPro[] = []
  mounted() {
    if (this.fileType == 'pdf') {
      this.refreshPdf(this.filePathTemp)
    } else {
      this.refreshOffice(this.filePathTemp, this.fileType)
    }
  }

  protected loadCompleted(childrenData: any[]) {}

  protected renderComponent(compCon: ComponentBase, layoutInfo: LayoutInfo, dragType?: DragItemTypeEnum): LayoutBase {
    var tmpNode = window.document.createElement('div')
    if (this.IsDesigning == true) {
      $(this.$el).append(tmpNode)
    } else {
      if (this.domCache) {
        this.domCache.appendChild(tmpNode)
      } else {
        $(this.$el).append(tmpNode)
      }
    }
    /**实例化组件壳子 */
    var compIn = new CompIncrustationPro()
    compIn.$mount(tmpNode)
    compIn.$forceUpdate()
    if (this.IsDesigning == true && this._dragHelper) {
      this._dragHelper.makeDomCanDrag(compIn.$el)
    }

    /**在组件壳子中添加组件 */
    compCon.parentPage = this
    compIn.AddComponent(compCon)
    this.PageComponentIncrustations.push(compIn)
    return compCon
  }

  protected onPropertyChangedInner(propertyId: string, property: Property, layout: ComponentBase): void {}

  bodyContent: any
  private refreshOffice(filePath: string, fileType: string) {
    let that = this
    fetch(filePath).then(function(response) {
      response.blob().then(function(tempdata: Blob) {
        let metadata = {
          type: 'application/octet-stream'
        }
        //let data = null
        let file = new File([tempdata], 'test', metadata)
        var reader = new FileReader()
        switch (fileType) {
          case 'doc':
          case 'docx':
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
              var oFile = XLSX.read(binary, { type: 'binary', cellDates: true, cellStyles: true })
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
            break
          case 'xml':
            break
          default:
            break
        }
      })
    })
  }

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

  radioChange(event: any) {
    //console.log('event', event)
    this.sheets.forEach((element) => {
      if (element.sheetName === event.target.value) {
        this.currentsheetContent = element.sheetContent
        //console.log('this.currentsheetContent',this.currentsheetContent)
        return
      }
    })
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

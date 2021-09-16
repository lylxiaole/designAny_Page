<template>
  <div class="clearfix" style="margin:100px">
    <a-upload :fileList="fileList" :remove="handleRemove" :beforeUpload="beforeUpload" accept=".xls,.xlsx,.csv">
      <a-button id="uploadfile79953769070592" value="">
        <a-icon type="upload" /> Excel文件选择 </a-button>
    </a-upload>
    <a-button type="primary" @click="handleUpload" :disabled="fileList.length === 0" :loading="uploading" style="margin-top: 16px">
      {{uploading ? '上传中' : '开始上传' }}
    </a-button>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import { CurrentApis, CurrentContext } from '../01designerContext'
import { fileInfo } from '../01designerContext'
import common from '../02common/commonMethod'
import fileUpload from '../02common/uploadFile/fileUpload'
import XLSX from 'xlsx'

@Component
export default class npUploadFile2 extends Vue {
  private fileList: any[] = []
  private dataTabel: any[] = []
  private uploading: boolean = false

  fileUploadClass: fileUpload = null

  @Emit('update:fileList')
  UpdateFileList_Inner(flist: fileInfo[]) {
    //console.log(flist)
  }
  mounted() {
    this.fileUploadClass = new fileUpload(CurrentContext.FileServerAddress)
  }
  handleRemove(file) {
    const index = this.fileList.indexOf(file)
    const newFileList = this.fileList.slice()
    newFileList.splice(index, 1)
    this.fileList = newFileList
  }
  beforeUpload(file) {
    this.fileList = []
    this.fileList.push(file)
    // this.fileUploadClass.startUpload(file, CurrentContext.GetUserToken())
    // this.fileUploadClass.onUploadSuccess = this.onUploadSuccess
    // this.fileUploadClass.onUploadError = this.onUploadError
    this.readWorkbookFromLocalFile(file, (data) => {
      //window.console.log('data: ', data)
      let result = []
      for (let index = 0; index < data.length; index++) {
        const element = data[index]
        //console.log('element: ', element)
        let arr = []
        for (let prop in element) {
          arr.push({
            name: prop,
            ct: typeof element[prop] === 'string' ? this.trim(this.clearBr(element[prop])) : element[prop],
          })
        }
        let obj = {}
        arr.forEach((item) => {
          obj[item.name] = item.ct
        })
        result.push(obj)
      }
      //console.log('result', result)
      this.upLoadCallBack(result)
      return
    })
    return false
  }
  handleUpload() {
    const { fileList } = this
    const formData = new FormData()
    this.uploading = true
    fileList.forEach((file) => {
      formData.append('files[]', file)
      this.fileUploadClass.startUpload(file, CurrentContext.GetUserToken())
    })
  }
  onUploadError(error: any) {
    this.uploading = false
    this.$message.error(error + `上传失败.`)
  }
  onUploadSuccess(relativePath: string, fileName: string) {
    var fileinfo = new fileInfo()
    fileinfo.uid = common.getUuid()
    fileinfo.name = fileName
    fileinfo.url = relativePath
    this.uploading = false
    var res = []
    if (this.fileList) {
      res = common.clone(this.fileList)
    }
    res.push(fileinfo)
    this.dataTabel = []
    this.fileList.forEach((element) => {
      this.readWorkbookFromLocalFile(element, (data) => {
        //window.console.log('data: ', data)
        this.upLoadCallBack(data)
        return
      })
    })

    this.UpdateFileList_Inner(res)
  }
  readWorkbookFromLocalFile(file, callback) {
    var reader = new FileReader()
    reader.onload = (e) => {
      var data = (e.target as any).result
      try {
        var workbook = XLSX.read(data, {
          type: 'binary',
          cellDates: true,
          // cellStyles: false
        })
      } catch (error) {
        console.log('error: ', error)
        this.$message.error('格式错误：不是一个Excel文件或文件已损坏。')
        return
      }
      if (callback) {
        const result = this.readWorkbook(workbook)
        callback(result)
      }
    }
    reader.readAsBinaryString(file)
  }
  readWorkbook(workbook) {
    var sheetNames = workbook.SheetNames // 工作表名称集合
    var worksheet = workbook.Sheets[sheetNames[0]] // 这里我们只读取第一张sheet
    let val = $(this.$el).find('#uploadfile79953769070592').val()
    for (let index = 0; index < val; index++) {
      this.deleteRow(worksheet, 0)
    }
    const sheet2JSONOpts = {
      /** Default value for null/undefined values */
      defval: '', //给defval赋值为空的字符串
    }
    var csv = XLSX.utils.sheet_to_json(worksheet, sheet2JSONOpts)
    return csv
  }
  encodeCell(r, c) {
    return XLSX.utils.encode_cell({ r, c })
  }

  deleteRow(ws, index) {
    const range = XLSX.utils.decode_range(ws['!ref'])
    for (let row = index; row < range.e.r; row++) {
      for (let col = range.s.c; col <= range.e.c; col++) {
        ws[this.encodeCell(row, col)] = ws[this.encodeCell(row + 1, col)]
      }
    }
    range.e.r--
    ws['!ref'] = XLSX.utils.encode_range(range.s, range.e)
  }

  deleteCol(ws, index) {
    const range = XLSX.utils.decode_range(ws['!ref'])
    for (let col = index; col < range.e.c; col++) {
      for (let row = range.s.r; row <= range.e.r; row++) {
        ws[this.encodeCell(row, col)] = ws[this.encodeCell(row, col + 1)]
      }
    }
    range.e.c--
    ws['!ref'] = XLSX.utils.encode_range(range.s, range.e)
  }
  //去除换行
  clearBr(key) {
    key = key.replace(/<\/?.+?>/g, '')
    key = key.replace(/[\r\n]/g, '')
    return key
  }
  //去掉字符串两端的空格
  trim(str) {
    return str.replace(/(^\s*)|(\s*$)/g, '')
  }
  //*********对外公布事件*********** */
  @Emit('upLoadCallBack')
  private upLoadCallBack(val: any) {}
}
</script>
<template>
  <div class="exportStyle"> 
    <geno-modal ref="exportInfo" :width="540" :title="type==='export'?'导出参数设置':'打印参数设置'" @cancel="handleCancel" v-model="visible"
      :maskClosable="false" :destroyOnClose="true" :okButtonProps="{ props: {icon: 'check'}}" :cancelButtonProps="{ props: {icon: 'close'}}">
      <div style="margin:-3px 0px -20px 10px;">
        <a-form :form="form" style="width:450px" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
          <a-form-item ref="fileName" label="文件名" style="margin-top:0px;margin-bottom:18px;">
            <a-input v-decorator="rule.fileName" placeholder="请输入" maxlength="50"></a-input>
          </a-form-item>
          <a-form-item ref="sheetName" label="表名" style="margin-top:0px;margin-bottom:18px;">
            <a-input v-decorator="rule.sheetName" placeholder="请输入" maxlength="50"></a-input>
          </a-form-item>
          <a-form-item ref="saveType" label="保存类型" style="margin-top:0px;margin-bottom:18px;">
            <a-select default-value="0">
              <a-select-option value="0">Excel 工作簿(*.xlsx)</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item ref="data" :label="type==='export'?'导出的数据':'打印的数据'" style="margin-top:0px;margin-bottom:18px;">
            <a-select  ref="dataType" default-value="0" @change="handleSelectChange">
              <a-select-option value="0">全部数据</a-select-option>
              <a-select-option value="1">当前数据</a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item ref="field" :label="type==='export'?'导出的字段':'打印的字段'">
            <a-col style="height:120px;margin-top:4px;overflow-y:auto;border:1px solid rgb(217,217,217)">
              <a-row style="background:#f1f1f1;">
                <a-checkbox class="checkAll" style="padding-left:10px;" :indeterminate="indeterminate" :checked="checkAll" @change="onCheckAllChange">
                  全部的字段</a-checkbox>
              </a-row>
              <a-row>
                <a-checkbox-group ref="checkboxGroup" :span="8" v-model="checkedList" :options="plainOptions" @change="onChange"
                  style="margin-left:10px;display:flex;flex-direction:column;" />
              </a-row>
            </a-col>

            <!-- v-if="disable==false" -->
          </a-form-item>
        </a-form>
      </div>
      <template slot="footer">
        <div style="margin-top:0px;margin-bottom:20px;margin-right:0px;">
          <a-button ref="cancelButton" key="取消" :style="{background:cancelSettingInfo.cancelBGNormal,color:cancelSettingInfo.cancelFontColor,
        borderColor:cancelSettingInfo.cancelBorderColor,fontSize: fontSize+'px', 'margin-right':'20px'}" @mouseover="onMouseOver('cancel')"
            @mouseout="onMouseOut('cancel')" @click="onMouseClick('cancel')">
            <img v-if="cancelImg!==''"  referrer="no-referrer|origin|unsafe-url" v-lazy="cancelImg" alt="image" :width="svgSize+'px'" :height="svgSize+'px'" style="margin-right:8px;margin-top:-3px;" />
            取消</a-button>
          <a-button ref="okButton" :key="type==='export'?'导出':'打印'" :style="{background:okSettingInfo.okBGNormal ,color:okSettingInfo.okFontColor,
        borderColor:okSettingInfo.okBorderColor,fontSize: fontSize+'px', 'margin-left':'0px'}" @mouseover="onMouseOver('ok')"
            @mouseout="onMouseOut('ok')" @click="onMouseClick('ok')">
            <img v-if="okImg!==''"  referrer="no-referrer|origin|unsafe-url" v-lazy="okImg" alt="image" :width="svgSize+'px'" :height="svgSize+'px'" style="margin-right:8px;margin-top:-3px;" />
            {{type==='export'?'导出':'打印'}}</a-button>
        </div>
      </template>
    </geno-modal>
  </div>

</template>

<script>
import moment from 'moment'
import xlsx from 'xlsx'
import { values } from 'xe-utils/methods'
export default {
  data() {
    return {
      moment,
      visible: false,
      dataSource: [],
      allDataSource:[],
      currentDataSource:[],
      columns: [],
      checkAll: false,
      checkedList: [],
      indeterminate: false,

      type: 'export',
      checkedColumns: [],
      clickCount: 0,
      exportDataType:0,

      rule: {
        fileName: [
          'fileName', 
          { rules: [{ required: true, message: '请输入文件名' },
          { pattern: '^[^\\\\/:*?"<>|]+$', message: '文件名不能包含这些字符：/:*?"<>|' }] }
        ],
        sheetName: [
          'sheetName',
          { rules: [{ required: true, message: '请输入表名' },
          { pattern: "^[^\\\\/:*?'\\[\\]]+$", message: "表名不能包含这些字符：/:*?'[]"}] }
        ],
      },
      form: this.$form.createForm(this, { name: 'exportInfo' }),

      cancelImg: '',
      okImg: '',

      isSelectedCancel: false,
      isSelectedOk: false,
    }
  },
  props: [
    'svgSize', //图标大小
    'fontSize',
    'cancelSettingInfo',
    'okSettingInfo',
  ],
  mounted() {
  },
  computed: {
    plainOptions() {
      if (this.columns.length > 0) {
        let arr = []
        this.columns.forEach((item, index) => {
          arr.push(item.title.toString())
        })
        return arr
      } else {
        return []
      }
    },
  },
  methods: {
    
    onCheckAllChange(e) {
      this.checkedList = e.target.checked ? this.plainOptions : []
      this.indeterminate = false
      this.checkAll = e.target.checked
    },
    onChange(e) {
      this.indeterminate = this.checkedList.length > 0 && this.checkedList.length < this.plainOptions.length
      this.checkAll = this.checkedList.length === this.plainOptions.length
    },
    view(type) {
      
      this.$nextTick(() => {
        let checkBoxItem = document.getElementsByClassName('ant-checkbox-wrapper ant-checkbox-group-item')
        if (checkBoxItem != undefined && checkBoxItem.length > 0) {
          for(let i=0;i<checkBoxItem.length;i++){
            checkBoxItem[i].style.marginTop = '8px'
            checkBoxItem[i].style.marginBottom = '8px'
          }
        }
         
      })

      this.type = type
      this.visible = true
      this.checkedList = []
      this.checkAll = false
      this.indeterminate = false

      this.cancelImg = this.cancelSettingInfo.cancelImageUrl
      this.okImg = this.okSettingInfo.okImagerUrl
      this.isSelectedCancel = false
      this.isSelectedOk = false
      this.exportDataType = 0

      if (this.type !== 'export') {
        this.$nextTick(() => {
          this.$refs.fileName.$el.style.display = 'none'
          this.$refs.sheetName.$el.style.display = 'none'
          this.$refs.saveType.$el.style.display = 'none'
        })
      }
    },
    handleCancel() {
      this.visible = false 
    },
    handleOk() {
      if (this.clickCount > 0) {
        return
      }
      this.clickCount++
      this.form.validateFieldsAndScroll((err, values) => {
        if(this.checkedList.length<1){
          this.$message.info("至少选择一个字段！")
          this.clickCount = 0
          return
        }
        if (err && this.type === 'export') {
          this.clickCount = 0
          this.okImg = this.okImagerUrl
          this.$refs.okButton.$el.style.background = this.okSettingInfo.okBGNormal
          this.$refs.okButton.$el.style.color = this.cancelSettingInfo.okFontColor
          return
        } else {
          if (this.type === 'export') {
            // 导出
            this.exportExcelData(values.fileName.trim(), values.sheetName.trim())
          }
          if (this.type === 'print') {
            //打印
            let arr = this.handleCheckedData()
            let result = {arr:arr, type: this.exportDataType}
            this.$emit('printData', result)
          }
          this.visible = false
          this.clickCount = 0
        }
      })
    },
    exportExcelData(fileName, sheetName) {
      //处理列名显示
      let resultColumns = this.handleCheckedData()
      let head = []
      let body = []
      if (resultColumns.length > 0) {
        resultColumns.forEach((item) => head.push(item.title))
      }
      if (head.length > 0) {
        body.push(head)
      }

      this.handleData(this.exportDataType===0?this.allDataSource:this.currentDataSource, body, resultColumns)
      var sheet = xlsx.utils.aoa_to_sheet(body)
      this.openDownloadDialog(this.sheet2blob(sheet, sheetName), fileName + '.xlsx')
    }, 
    handleCheckedData() {
      let arr = []
      if (this.columns.length > 0) {
        this.columns.forEach((element) => {
          let index = this.checkedList.findIndex((item) => item === element.title)
          element.isShow = index > -1
          arr.push(element)
        })
      }
      return arr
    },
    handleSelectChange(value){ 
      this.exportDataType = value
    }, 

    handleData(dataSource, bodyData, headData) {
      if (dataSource.length > 0) {
        dataSource.forEach((data) => {
          if (data.type === 'task') {
            let body = []
            if (headData.length > 0) {
              headData.forEach((item) => {
                if (item.isShow) {
                  switch (item.field) {
                    case 'planBeginTime':
                    case 'planEndTime':
                    case 'actualBeginTime':
                    case 'actualEndTime':
                      var time = moment(data[item.field])
                      body.push(time.format('YYYY-MM-DD hh:mm:ss'))
                      break
                    default:
                      body.push(data[item.field])
                      break
                  }
                }
              })
            }
            bodyData.push(body)
          } else if (data.children != undefined && data.children.length > 0) {
            this.handleData(data.children, bodyData, headData)
          }
        })
      }
    },

    /**
     * 通用的打开下载对话框方法，没有测试过具体兼容性
     * @param url 下载地址，也可以是一个blob对象，必选
     * @param saveName 保存文件名，可选
     */
    openDownloadDialog(url, saveName) {
      console.error('来下载文件拉');
      if (typeof url == 'object' && url instanceof Blob) {
        url = URL.createObjectURL(url) // 创建blob地址
      }
      var aLink = document.createElement('a')
      aLink.href = url
      aLink.download = saveName || '' // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
      var event
      if (window.MouseEvent) event = new MouseEvent('click')
      else {
        event = document.createEvent('MouseEvents')
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null)
      }
      aLink.dispatchEvent(event)
    },
    // csv转sheet对象
    csv2sheet(csv) {
      var sheet = {} // 将要生成的sheet
      csv = csv.split('\n')
      csv.forEach(function(row, i) {
        row = row.split(',')
        if (i == 0) sheet['!ref'] = 'A1:' + String.fromCharCode(65 + row.length - 1) + (csv.length - 1)
        row.forEach(function(col, j) {
          sheet[String.fromCharCode(65 + j) + (i + 1)] = { v: col }
        })
      })
      return sheet
    },

    // 将一个sheet转成最终的excel文件的blob对象，然后利用URL.createObjectURL下载
    sheet2blob(sheet, sheetName) {
      sheetName = sheetName || 'sheet1'
      var workbook = {
        SheetNames: [sheetName],
        Sheets: {},
      }
      workbook.Sheets[sheetName] = sheet
      // 生成excel的配置项
      var wopts = {
        bookType: 'xlsx', // 要生成的文件类型
        bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
        type: 'binary',
      }
      var wbout = xlsx.write(workbook, wopts)
      var blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
      // 字符串转ArrayBuffer
      function s2ab(s) {
        var buf = new ArrayBuffer(s.length)
        var view = new Uint8Array(buf)
        for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
        return buf
      }
      return blob
    },

    onMouseOver(buttom) { //按钮悬浮
      if (buttom === 'cancel') {
        this.$refs.cancelButton.$el.style.background = this.cancelSettingInfo.cancelBGOver
      }
      if (buttom === 'ok') {
        this.$refs.okButton.$el.style.background = this.okSettingInfo.okBGOver
      }
    },
    onMouseOut(buttom) {//按钮离开
      if (buttom === 'cancel') {
        if (this.isSelectedCancel) {
          this.$refs.cancelButton.$el.style.background = this.cancelSettingInfo.cancelBGClick
        } else {
          this.$refs.cancelButton.$el.style.background = this.cancelSettingInfo.cancelBGNormal
        }
      }
      if (buttom === 'ok') {
        if (this.isSelectedOk) {
          this.$refs.okButton.$el.style.background = this.okSettingInfo.okBGClick
        } else {
          this.$refs.okButton.$el.style.background = this.okSettingInfo.okBGNormal
        }
      }
    },
    onMouseClick(buttom) {//按钮点击
      if (buttom === 'cancel') {
        this.isSelectedCancel = true
        this.isSelectedOk = false
        this.cancelImg = this.cancelSettingInfo.cancelClickImageUrl
        this.$refs.cancelButton.$el.style.background = this.cancelSettingInfo.cancelBGClick
        this.$refs.cancelButton.$el.style.color = this.cancelSettingInfo.cancelFontClickColor
        this.handleCancel()
      }
      if (buttom === 'ok') {
        this.isSelectedCancel = false
        this.isSelectedOk = true
        this.okImg = this.okSettingInfo.okClickImagerUrl
        this.$refs.okButton.$el.style.background = this.okSettingInfo.okBGClick
        this.$refs.okButton.$el.style.color = this.okSettingInfo.okFontClickColor
        this.handleOk()
      }
    },

  },
}
</script>

<style scoped>
.checkAll .ant-checkbox {
  top: -8px;
  color: aqua;
}

.exportStyle .ant-modal-footer {
  padding-top: 30px;
  padding-bottom: 30px;
  padding-right: 30px;
}
.ant-checkbox-wrapper .ant-checkbox-group-item {
  margin-top: 10px;
}
</style>
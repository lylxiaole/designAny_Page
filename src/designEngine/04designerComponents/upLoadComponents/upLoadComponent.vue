<template>
  <div class="clearfix" style="min-height:7em">
    <a-upload :disabled="disabled" :listType="listType" :fileList="currentFileList" :beforeUpload="beforeUpload" @change="handleChange"
      :remove="handleRemove" :accept="fileType" :showUploadList="showUploadList" :multiple="multiple">
      <div :style=" {background:backgroundColor,color:fontColor}" v-if="currentFileList.length<maxFileLengthParent">
        <div>
          <a-button :style=" {background:backgroundColor,color:fontColor}" v-if="'picture-card'!=listType">
            <img v-if="imageUrl" v-lazy="imageUrl" :width="15+'px'" :height="15+'px'" />
            <a-icon v-else type="upload" /> {{btnText}}
          </a-button>
          <div v-else :style=" {background:backgroundColor,color:fontColor}">
            <img v-if="imageUrl" v-lazy="imageUrl" :width="15+'px'" :height="15+'px'" />
            <a-icon v-else type="plus" />
            {{btnText}}
          </div>
        </div>
        <!-- <div v-show="currentFileList.length>=maxFileLengthParent">
          <div>已到达最大数量</div>
        </div> -->
      </div>
    </a-upload>
    <!-- <geno-modal :closable="false" :visible="previewVisible" cancelText="取消" okText="确定" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" v-lazy="previewImage" referrer="no-referrer|origin|unsafe-url"  />
    </geno-modal> -->
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import { ComponentBase } from '../../03designerLayoutBase'
import { CurrentApis, fileInfo, CurrentContext } from '../../01designerContext'
import {
  Property,
  Text_Property,
  Behavior_Property,
  Enum_Property,
  PropertyGroupName,
  Boolean_Property,
  Number_Property,
  UploadFile_Property,
  Color_Property,
  BindingModels_Property
} from '../../03designerLayoutBase'
import common from '../../02common/commonMethod'
import { param, paramType } from '../../03designerLayoutBase'
import fileUpload from '../../02common/uploadFile/fileUpload'

@Component({
  components: {}
})
export default class upLoadComponent extends ComponentBase {
  inparam: param[]
  outparam: param
  private fileList: fileInfo[] = []

  get currentFileList(): fileInfo[] {
    var fileArr = this.findPropertyByName(PropertyGroupName.special, '文件列表')
    var maxProp = this.findPropertyByName(PropertyGroupName.special, '文件最大数量')
    if (fileArr == undefined) return []
    if (!this.fileList || !this.fileUploadClass) {
      this.setPropertyVal(fileArr.id, null)
      return []
    }
    var maxLenth = maxProp.value
    var files: fileInfo[] = []
    var absolutefiles: fileInfo[] = []
    this.fileList.filter((o) => {
      var info = new fileInfo()
      info.uid = o.uid
      info.name = o.name
      info.url = this.fileUploadClass.getFilePath(o.url)
      var ab_info = common.clone(info)
      ab_info.url = o.url
      files.push(info)
      absolutefiles.push(ab_info)
    })

    if (maxLenth == 1) {
      if (absolutefiles.length > 0) {
        this.setPropertyVal(fileArr.id, absolutefiles[0])
      } else {
        this.setPropertyVal(fileArr.id, new fileInfo())
      }
      // var fileName = this.findPropertyByName(PropertyGroupName.special, '文件名')
      // this.setPropertyVal(fileName.id, files[0].name)
    } else {
      this.setPropertyVal(fileArr.id, absolutefiles)
    }

    return files
  }

  set currentFileList(val: fileInfo[]) {}

  //--------------------------------------------------------------------------
  // private get fileLists(): fileInfo[] {
  //   window.console.log('上传文件完成了get')
  //   var property = this.findPropertyByName(PropertyGroupName.special, '文件列表')
  //   if (property) {
  //     return property.value as fileInfo[]
  //   } else {
  //     return []
  //   }
  // }
  // private set fileLists(filelist: fileInfo[]) {
  //   window.console.log('上传文件完成了set')
  //   var propertyId = this.findPropertyByName(PropertyGroupName.special, '文件列表').id
  //   this.setPropertyVal(propertyId, filelist)
  // }
  upLoadCallBack(relativePath: String) {
    var inParams: param[] = []
    var para = new param()
    para.name = '文件相对路径'
    para.type = paramType.string
    para.val = relativePath

    inParams.push(para)

    this.triggeEvent('文件上传成功', inParams)
  }

  onUploadError(error: any) {
    this.$message.error(error + `file upload failed.`)
  }
  fileTypes(ft: String): string {
    if (ft == '不限') {
      return '*.*'
    } else if (ft == '图像文件') {
      return 'image/*'
    } else if (ft == '音频文件') {
      return 'audio/*'
    } else if (ft == '视频文件') {
      return 'video/*'
    } else if (ft == 'Word') {
      return '.docx,.doc'
    } else if (ft == 'Excel') {
      return '.csv,.xls,.xlsx'
    } else {
      return '*.*'
    }
  }

  get fileType(): string {
    let fileType = this.findPropertyByName(PropertyGroupName.special, '文件格式筛选')
    if (fileType == undefined || fileType.value == '') {
      if (this.findProperties(PropertyGroupName.special, '文件格式')[0]) {
        return this.fileTypes(this.findProperties(PropertyGroupName.special, '文件格式')[0].value as any)
      } else {
        return this.fileTypes('不限')
      }
    } else {
      return fileType.value
    }
  }

  get fontColor(): String {
    if (this.findPropertyByName(PropertyGroupName.normal, '前景色')) {
      return this.findPropertyByName(PropertyGroupName.normal, '前景色').value as String
    } else {
      return ''
    }
  }

  get backgroundColor(): String {
    if (this.findPropertyByName(PropertyGroupName.normal, '背景色')) {
      return this.findPropertyByName(PropertyGroupName.normal, '背景色').value as String
    } else {
      return ''
    }
  }

  get imageUrl(): String {
    if (
      this.findPropertyByName(PropertyGroupName.normal, '背景图片') &&
      this.findPropertyByName(PropertyGroupName.normal, '背景图片').value &&
      this.findPropertyByName(PropertyGroupName.normal, '背景图片').value[0]
    ) {
      var address = (CurrentContext.FileServerAddress +
        this.findPropertyByName(PropertyGroupName.normal, '背景图片').value[0].url.split('?')[0]) as String
      //window.console.log(address)
      return address
    } else {
      return ''
    }
  }

  get upLoadSize(): number {
    if (this.findProperties(PropertyGroupName.special, '文件大小不超过')[0]) {
      return this.findProperties(PropertyGroupName.special, '文件大小不超过')[0].value as any
    } else {
      return 2
    }
  }

  get maxFileLengthParent(): number {
    if (this.findProperties(PropertyGroupName.special, '文件最大数量')[0]) {
      return this.findProperties(PropertyGroupName.special, '文件最大数量')[0].value as any
    } else {
      return 10
    }
  }

  get disabled(): boolean {
    // if (this.findProperties(PropertyGroupName.normal, '是否禁用')[0]) {
    //   if (this.findProperties(PropertyGroupName.normal, '是否禁用')[0].value) {
    //     return true
    //   } else {
    //     if (typeof this.fileList == 'undefined' || this.fileList.length < this.maxFileLengthParent) {
    //       return false
    //     } else {
    //       return true
    //     }
    //   }
    // } else {
    //   return false
    // }
    var property = this.findPropertyByName(PropertyGroupName.normal, '是否禁用')
    this.$nextTick(() => {
      $(this.$el)
        .find('.ant-upload-list-item-actions')
        .css('display', 'none')
    })

    if (property) {
      return property.value as boolean
    }
    return false
  }

  get listType(): string {
    if (this.findPropertyByName(PropertyGroupName.special, '列表样式')) {
      return this.findPropertyByName(PropertyGroupName.special, '列表样式').value
    } else {
      return 'picture-card'
    }
  }

  get showUploadList(): boolean {
    if (this.findProperties(PropertyGroupName.special, '是否显示已上传文件列表')[0]) {
      return this.findProperties(PropertyGroupName.special, '是否显示已上传文件列表')[0].value as boolean
    }
    return true
  }

  get btnText(): string {
    var txt = this.findPropertyByName(PropertyGroupName.special, '按钮文本')
    if (txt) {
      return txt.value as string
    }
    return ''
  }

  get todoFileList(): fileInfo[] {
    var fileArr = this.findPropertyByName(PropertyGroupName.special, '待显示文件列表')
    return fileArr.value as fileInfo[]
  }

  get multiple(): boolean {
    let isMultiple = this.findPropertyByName(PropertyGroupName.special, '是否多选文件')
    if (isMultiple) {
      return isMultiple.value as boolean
    } else {
      return false
    }
  }

  private previewVisible: boolean = false
  private previewImage: string = ''
  fileUploadClass: fileUpload = null
  mounted() {
    this.width = 100
    this.height = 100
    //属性改变触发
    //this.$on('onPropertyChanged', this.onCurrentPropertyChanged)
    this.fileUploadClass = new fileUpload(CurrentContext.BusinessFileServerAddress)
    this.fileUploadClass.onUploadSuccess = this.onUploadSuccess
    this.fileUploadClass.onUploadError = this.onUploadError
    this.fileUploadClass.onUploadProgress = this.onUploadProgress
    var inParams: param[] = []
    var para = new param()
    para.name = '文件相对路径'
    para.type = paramType.string
    inParams.push(para)
    this.registerEvents('文件上传成功', null, inParams, null)

    this.registerProperty(
      '文件格式',
      PropertyGroupName.special,
      new Enum_Property(true, ['不限', '图像文件', '音频文件', '视频文件', 'Word', 'Excel']),
      '不限'
    )
    this.registerProperty('文件格式筛选', PropertyGroupName.special, new Text_Property(), '')
    this.registerProperty('文件列表', PropertyGroupName.special, null, [])
    this.registerProperty('待显示文件列表', PropertyGroupName.special, null, [])
    this.registerProperty('文件', PropertyGroupName.special, null, null)
    this.registerProperty('文件大小不超过', PropertyGroupName.special, new Number_Property(), 2)

    this.registerProperty('文件最大数量', PropertyGroupName.special, new Number_Property(), 10)
    this.registerProperty('按钮文本', PropertyGroupName.special, new Text_Property(), '上传文件')
    this.registerProperty('是否多选文件', PropertyGroupName.special, new Boolean_Property(), false)
    //this.registerProperty('文件名', PropertyGroupName.special, new Text_Property(), '文件名', false)

    //this.registerProperty('是否禁用', PropertyGroupName.special, new Boolean_Property(), false)

    //this.registerProperty('前景色', PropertyGroupName.special, new Color_Property(), '')

    //this.registerProperty('背景色', PropertyGroupName.special, new Color_Property(), '')

    // this.registerProperty('背景图片', PropertyGroupName.special, new UploadFile_Property(1, 'image'))

    this.registerProperty('列表样式', PropertyGroupName.special, new Enum_Property(true, ['text', 'picture', 'picture-card']), 'picture-card')

    this.registerProperty('是否显示已上传文件列表', PropertyGroupName.special, new Boolean_Property(), true)

    this.registerEvents('上传文件改变时的状态事件', '', this.inparam, this.outparam)
    //this.registerEvents('点击文件链接或预览图标时的事件', '', this.inparam, this.outparam)

    this.$on('onPropertyChanged', (propertyId: string, property: Property, layout: any) => {
      if (property.propertyName != '待显示文件列表') {
        return
      }
      var fileArr = this.findPropertyByName(PropertyGroupName.special, '待显示文件列表')
      var maxprop = this.findPropertyByName(PropertyGroupName.special, '文件最大数量')
      if (fileArr.value) {
        this.fileList = []
        this.currentFileList = []
        if (maxprop.value == 1) {
          if (fileArr.value.url != undefined) {
            var f = new fileInfo()
            f.uid = fileArr.value.id
            f.name = fileArr.value.name
            f.status = 'done'
            f.url = fileArr.value.url
            this.fileList.push(f)
          }
        } else {
          fileArr.value.forEach((file) => {
            var f = new fileInfo()
            f.uid = file.id
            f.name = file.name
            f.status = 'done'
            f.url = file.url
            this.fileList.push(f)
          })
        }
      } else {
        this.fileList = []
        this.currentFileList = []
      }
    })

    this.registerMethods('清除数据', '', this.clearData, null, null)
  }

  handleCancel() {
    this.previewVisible = false
  }
  // handlePreview(file: any) {
  //   window.console.log('aaaaaa')
  //   this.previewImage = file.url || file.thumbUrl

  //   this.previewVisible = true
  //   this.triggeEvent('点击文件链接或预览图标时的事件', file)
  // }

  handleChange(file: any) {
    //window.console.log(file)
    this.triggeEvent('上传文件改变时的状态事件', file)
  }

  handleRemove(file: fileInfo) {
    var filesclone = [...this.fileList]
    var findfile = filesclone.filter((o) => o.uid == file.uid)[0]

    var findfileIndex = filesclone.indexOf(findfile)
    filesclone.splice(findfileIndex, 1)
    //this.UpdateFileList_Inner(filesclone)
    this.fileList = filesclone
  }
  beforeUpload(file: any, fileList: any[]) {
    const isUpLoadSize = file.size / 1024 / 1024 < this.upLoadSize
    if (!isUpLoadSize) {
      //this.$message.error('file must smaller than ' + this.upLoadSize + 'MB!')
      this.$message.warning('文件大小必须小于 ' + this.upLoadSize + 'MB!')
      return
    } else {
      if (!this.validateFileFormat(file.name)) {
        this.$message.info('上传文件格式不正确。')
        return
      }
      this.fileUploadClass.startUpload(file, CurrentContext.GetUserToken(), true)
    }
    return false
  }

  onUploadProgress(part: string, precent: number) {
    //window.console.log('上传了' + precent + '%')
  }

  onUploadSuccess(relativePath: string, fileName: string) {
    var fileinfo = new fileInfo()
    fileinfo.uid = common.getUuid()
    fileinfo.name = fileName
    fileinfo.url = relativePath
    //window.console.log('上传文件大小子')
    // var res = []
    // if (this.fileList) {
    //   res = common.clone(this.fileList)
    // }
    // res.push(fileinfo)
    this.fileList.push(fileinfo)

    //添加操作赋值文件列表
    var fileArr = this.findPropertyByName(PropertyGroupName.special, '文件列表')
    var maxprop = this.findPropertyByName(PropertyGroupName.special, '文件最大数量')
    if (fileArr == undefined) return []
    if (!this.fileList || !this.fileUploadClass) {
      this.setPropertyVal(fileArr.id, null)
      return []
    }
    var maxLenth = maxprop.value
    var files: fileInfo[] = []
    var absolutefiles: fileInfo[] = []
    this.fileList.filter((o) => {
      var info = new fileInfo()
      info.uid = o.uid
      info.name = o.name
      info.url = this.fileUploadClass.getFilePath(o.url)
      var ab_info = common.clone(info)
      ab_info.url = o.url
      files.push(info)
      absolutefiles.push(ab_info)
    })

    if (maxLenth == 1) {
      this.setPropertyVal(fileArr.id, absolutefiles[0])
    } else {
      this.setPropertyVal(fileArr.id, absolutefiles)
    }

    //this.UpdateFileList_Inner(res)
    this.upLoadCallBack(relativePath)
  }

  //获取文件扩展
  getFileExtension(fileName: string) {
    var index = fileName.lastIndexOf('.')
    var len = fileName.length
    var type = fileName.substring(index, len)
    return type
  }

  //校验上传文件格式是否正确
  validateFileFormat(fileName: string) {
    var imgArr = [
      '.tiff',
      '.svgz',
      '.pjp',
      '.webp',
      '.jpeg',
      '.ico',
      '.jfif',
      '.gif',
      '.tif',
      '.xbm',
      '.pjpeg',
      '.bmp',
      '.jpg',
      '.svg',
      '.png',
      '.dib'
    ]
    var audioArr = ['.mp3', '.ogg', '.wma', '.weba', '.wav', '.opus', '.m4a', '.oga', '.webm', '.mid', '.au', '.flac', '.aiff']
    var videoArr = ['.ogm', '.wmv', '.asx', '.mov', '.mpeg', '.ogv', '.mp4', '.mpg', '.webm', '.m4v', '.avi']
    var fileExtension = this.getFileExtension(fileName).toLowerCase()
    if (this.fileType == '*.*') {
      return true
    } else if (this.fileType == 'image/*') {
      return imgArr.indexOf(fileExtension) > -1 ? true : false
    } else if (this.fileType == 'audio/*') {
      return audioArr.indexOf(fileExtension) > -1 ? true : false
    } else if (this.fileType == 'video/*') {
      return videoArr.indexOf(fileExtension) > -1 ? true : false
    } else if (this.fileType == '.docx,.doc') {
      return ['.docx', '.doc'].indexOf(fileExtension) > -1 ? true : false
    } else if (this.fileType == '.csv,.xls,.xlsx') {
      return ['.csv', '.xls', 'xlsx'].indexOf(fileExtension) > -1 ? true : false
    } else {
      return this.fileType.indexOf(fileExtension) > -1 ? true : false
    }
  }
  /*
  属性变化事件
  */
  private onCurrentPropertyChanged(propertyId: string, property: Property, comp: ComponentBase): void {
    //window.console.info('onCurrentPropertyChanged', property)
    if (property.propertyName === '宽度') {
      $(this.$el)
        .find('.ant-upload-list-picture-card .ant-upload-list-item')
        .css('width', property.value + 'px')
      $(this.$el)
        .find('.ant-upload.ant-upload-select-picture-card')
        .css('width', property.value + 'px')
    } else if (property.propertyName === '高度') {
      $(this.$el)
        .find('.ant-upload-list-picture-card .ant-upload-list-item')
        .css('height', property.value + 'px')
      $(this.$el)
        .find('.ant-upload.ant-upload-select-picture-card')
        .css('height', property.value + 'px')
    }
  }

  private clearData() {
    this.fileList = []
    this.currentFileList = []
  }
}
</script>

<style lang="less">
.ant-upload-list {
  overflow: auto;
  height: 100%;
}
</style>
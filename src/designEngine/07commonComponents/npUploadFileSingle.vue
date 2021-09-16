<template>
  <div class="clearfix" style="margin:100px">
    <a-upload :beforeUpload="beforeUpload" :accept="fileTypes">
      <a-button id="uploadfile79953769070592" value="">
        <a-icon type="upload" /> Excel文件选择 </a-button>
    </a-upload>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import { CurrentApis, CurrentContext } from '../01designerContext'
import { fileInfo } from '../01designerContext'
import common from '../02common/commonMethod'
import fileUpload from '../02common/uploadFile/fileUpload'

@Component
export default class npUploadFileSingle extends Vue {
  fileUploadClass: fileUpload = null
  fileTypes: string = '*.*'

  @Prop() private maxFileLength: number

  // @Prop() private disabled: boolean
  @Prop() private upLoadSize: number
  @Prop() private backgroundColor: string
  @Prop() private fontColor: string
  @Prop() private imageUrl: string

  @Emit('upLoadCallBack')
  private upLoadCallBack(relativePath: any) {}
  @Emit('upLoadCompleted')
  private upLoadCompleted(fileList: fileInfo[]) {}
  @Emit('onFileTypeChanged')
  private onFileTypeChanged() {}

  public setFileType(ftype: string) {
    if (ftype == 'vectorgraph') {
      this.fileTypes = '.png,.jpg,.gif'
    } else if (ftype == 'image') {
      this.fileTypes = 'image/*'
    } else if (ftype == 'file') {
      this.fileTypes = '.doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    } else if (ftype == 'vedio') {
      this.fileTypes = 'video/*'
    } else {
      this.fileTypes = '*.*'
    }

    $(this.$el)
      .find('input')
      .attr('accept', this.fileTypes)
  }

  mounted() {
    this.fileUploadClass = new fileUpload(CurrentContext.FileServerAddress)
    this.fileUploadClass.onUploadSuccess = this.onUploadSuccess
    this.fileUploadClass.onUploadError = this.onUploadError
    this.fileUploadClass.onUploadProgress = this.onUploadProgress
  }

  showUpload() {
    $(this.$el)
      .find('#uploadfile79953769070592')
      .click()
  }

  /**切换文件服务地址 */
  changeFileServer(url) {
    this.fileUploadClass.changeFileServer(url)
  }

  beforeUpload(file) {
    const isUpLoadSize = file.size / 1024 / 1024 < this.upLoadSize
    if (!isUpLoadSize) {
      this.$message.warning('文件大小不能大于' + this.upLoadSize + 'MB!')
      return
    } else {
      this.fileUploadClass.startUpload(file, CurrentContext.GetUserToken())
    }
    return false
  }

  onUploadProgress(part: string, precent: number) {
    //window.console.log('上传了' + precent + '%')
  }
  onUploadError(error: any) {
    this.$message.error(error + `上传失败.`)
  }

  onUploadSuccess(relativePath: string, fileName: string) {
    var fileinfo = new fileInfo()
    fileinfo.uid = common.getUuid()
    fileinfo.name = fileName
    fileinfo.url = relativePath
    //window.console.log('上传文件大小子')
    var res = [fileinfo]
    this.upLoadCallBack(relativePath)
    this.upLoadCompleted(res)
  }
}
</script>
<template>
  <div>
    <a-button class="themeButton" type="primary" @click="showUploadModal" size="small"
      style="width:82px;height:30px;background:rgba(24,183,101,1);border-radius:2px;border:1px solid rgba(12,155,81,1);border-color:rgba(24,183,101,1);">
      <img v-if="imageUrl" v-lazy="imageUrl" :width="15+'px'" :height="15+'px'" />
      <span>上传文件</span>
    </a-button>
    <geno-modal :maskClosable="false" title="选择文件" v-model="windowVisible" @cancel="handleWindowClose" @ok="handleWindowOK" :footer="null"
      style="width:60%;height:40%" :destroyOnClose="true" :okButtonProps="{ props: {icon: 'check'}}" :cancelButtonProps="{ props: {icon: 'close'}}"
      cancelText="取消" okText="确定">
      <div style="min-height:7em">
        <a-upload :disabled="uploadDisable" listType="picture-card" :fileList="currentFileList" :beforeUpload="beforeUpload" @preview="handlePreview"
          @change="handleChange" :remove="handleRemove" :accept="fileTypes">
          <div onselectstart="return false;">
            <div v-if="currentFileList.length<maxFileLength">
              <a-icon type="plus" />
              <div>选择文件</div>
            </div>
            <div v-else>
              <div>已到达最大数量</div>
            </div>
          </div>
        </a-upload>
        <geno-modal :closable="false" :visible="previewVisible" :footer="null" @cancel="handlePreviewClose" @ok="handlePreviewClose"
          :destroyOnClose="true" cancelText="" okText="" :okButtonProps="{ props: {icon:'check'}}" :cancelButtonProps="{ props: {icon:'close'}}">
          <img alt="example" style="width: 100%" :src="previewImage" cancelText="取消" okText="确定" />
        </geno-modal>
      </div>
    </geno-modal>

  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
import { CurrentApis, CurrentContext } from '../01designerContext'
import { fileInfo } from '../01designerContext'
import common from '../02common/commonMethod'
import fileUpload from '../02common/uploadFile/fileUpload'

@Component
export default class npUploadFile extends Vue {
  @Prop() private fileList: fileInfo[]
  @Prop() private maxFileLength: number
  @Prop() private fileType: string
  // @Prop() private disabled: boolean
  @Prop() private upLoadSize: number

  @Prop() private backgroundColor: string
  @Prop() private fontColor: string
  @Prop() private imageUrl: string
  // imageUrlC: string = ''

  @Emit('update:fileList')
  UpdateFileList_Inner(flist: fileInfo[]) {
    //console.log(flist)
  }

  // @Watch('imageUrlF')
  // imageUrlChange() {
  //   this.imageUrlC = this.imageUrlF
  // }

  get currentFileList(): fileInfo[] {
    if (!this.fileList || !this.fileUploadClass) {
      return []
    }
    var files: fileInfo[] = []
    this.fileList.filter((o) => {
      var info = new fileInfo()
      info.uid = o.uid
      info.name = o.name
      info.url = this.fileUploadClass.getFilePath(o.url)
      files.push(info)
    })
    return files
  }

  get uploadDisable(): boolean {
    if (this.currentFileList.length < this.maxFileLength) {
      return false
    } else {
      return true
    }
  }

  get fileTypes(): string {
    if (this.fileType == 'vectorgraph') {
      return '.png,.jpg,.gif'
    } else if (this.fileType == 'image') {
      return 'image/*'
    } else if (this.fileType == 'file') {
      return '.doc,.docx,.xml,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    } else if (this.fileType == 'vedio') {
      return 'video/*'
    } else {
      return '*.*'
    }
  }

  private windowVisible: boolean = false
  private previewVisible: boolean = false
  private previewImage: string = ''
  fileUploadClass: fileUpload = null
  mounted() {
    this.fileUploadClass = new fileUpload(CurrentContext.FileServerAddress)
    this.fileUploadClass.onUploadSuccess = this.onUploadSuccess
    this.fileUploadClass.onUploadError = this.onUploadError
    this.fileUploadClass.onUploadProgress = this.onUploadProgress
  }

  /**切换文件服务地址 */
  changeFileServer(url) {
    this.fileUploadClass.changeFileServer(url)
  }
  showUploadModal() {
    this.windowVisible = true
  }

  handleWindowClose() {
    //window.console.log('确定')
    this.windowVisible = false
  }

  handleWindowOK() {
    this.windowVisible = false
    this.upLoadCompleted(this.fileList)
  }

  handlePreviewClose() {
    this.previewVisible = false
  }

  handlePreview(file: any) {
    //window.console.log('aaaaaa')
    this.previewImage = file.url || file.thumbUrl
    this.previewVisible = true
  }

  handleChange(file: any) {
    //window.console.log(file)
  }

  handleRemove(file: fileInfo) {
    var filesclone = [...this.fileList]
    var findfile = filesclone.filter((o) => o.uid == file.uid)[0]

    var findfileIndex = filesclone.indexOf(findfile)
    filesclone.splice(findfileIndex, 1)
    this.UpdateFileList_Inner(filesclone)
  }
  beforeUpload(file: any, fileList: any[]) {
    const isUpLoadSize = file.size / 1024 / 1024 < this.upLoadSize
    if (!isUpLoadSize) {
      this.$message.error('file must smaller than ' + this.upLoadSize + 'MB!')
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
    this.$message.error(error + `file upload failed.`)
  }

  onUploadSuccess(relativePath: string, fileName: string) {
    var fileinfo = new fileInfo()
    fileinfo.uid = common.getUuid()
    fileinfo.name = fileName
    fileinfo.url = relativePath
    //window.console.log('上传文件大小子')
    var res = []
    if (this.fileList) {
      res = common.clone(this.fileList)
    }
    res.push(fileinfo)
    this.UpdateFileList_Inner(res)
    this.upLoadCallBack(relativePath)
  }
  //*********对外公布事件*********** */
  @Emit('upLoadCompleted')
  private upLoadCompleted(fileList: fileInfo[]) {}

  @Emit('upLoadCallBack')
  private upLoadCallBack(relativePath: any) {}
}
</script>



<style lang="less" scoped>
@import '../assets/globlaTheme.less';
.hideClass {
  display: none;
}
</style>
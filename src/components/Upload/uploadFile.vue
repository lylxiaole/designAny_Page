<template>
  <div>
    <el-button class="themeButton" type="primary" @click="showUploadModal" size="small"
      style="width:82px;height:30px;background:rgba(24,183,101,1);border-radius:2px;border:1px solid rgba(12,155,81,1);border-color:rgba(24,183,101,1);">
      <img v-if="imageUrl" v-lazy="imageUrl" :width="15+'px'" :height="15+'px'" />
      <span>上传文件</span>
    </el-button>
    <el-dialog :maskClosable="false" title="选择文件" :visible.sync="windowVisible" width="60%" :destroyOnClose="true">
      <div style="min-height:7em">
        <el-upload action="#" :auto-upload="false" :file-list="currentFileList" :before-upload="beforeUpload" :on-change="handleChange"
          :accept="fileTypes" :limit="maxFileLength" list-type="picture-card">
          <!-- ****上传文件的按钮************************************ -->
          <div v-if="currentFileList.length<maxFileLength" slot="default" style="height:100%;width:100%"
            class="flexHorilanLayout verticalAlignCenter">
            <i class="el-icon-plus"></i>
          </div>
          <div v-else slot="default" style="height:100%;width:100%" class="flexHorilanLayout verticalAlignCenter">
            上传数量已经到达最大
          </div>
          <!-- ****已上传文件************************************ -->
          <div slot="file" slot-scope="{file}">
            <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
            <span class="el-upload-list__item-actions">
              <span class="el-upload-list__item-preview" @click="handlePreview(file)">
                <i class="el-icon-zoom-in"></i>
              </span>
              <span class="el-upload-list__item-delete" @click="handleRemove(file)">
                <i class="el-icon-delete"></i>
              </span>
            </span>
          </div>
        </el-upload>
        <!-- ****预览窗口************************************ -->
        <el-dialog :visible.sync="previewVisible">
          <img alt="example" style="width: 100%" :src="previewImage" cancelText="取消" okText="确定" />
          <div slot="footer" class="dialog-footer">
            <el-button @click="handlePreviewClose">取 消</el-button>
            <el-button type="primary" @click="handlePreviewClose">确 定</el-button>
          </div>
        </el-dialog>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="handleWindowClose">取 消</el-button>
        <el-button type="primary" @click="handleWindowOK">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
export class fileInfo {
  uid: string = 'uid' // 文件唯一标识，建议设置为负数，防止和内部产生的 id 冲突
  status: string = 'done' // 状态有：uploading done error removed
  response: string = '{status: success}' // 服务端响应内容
  name: string
  get thumbUrl(): string {
    //应对IE的兼容性
    return this.url
  }
  url: string
}

import { Component, Prop, Vue, Emit, Watch } from 'vue-property-decorator'
// import { CurrentApis, CurrentContext } from '../01designerContext'
// import { fileInfo } from '../01designerContext'
import { getUuid, deepClone } from '@src/utils'
import fileUpload from './fileUpload'

@Component
export default class uploadFile extends Vue {
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
  UpdateFileList_Inner(flist: fileInfo[]) {}

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
  private fileUploadClass: fileUpload = null
  mounted() {
    this.fileUploadClass = new fileUpload()
    this.fileUploadClass.onUploadSuccess = this.onUploadSuccess
    this.fileUploadClass.onUploadError = this.onUploadError
    this.fileUploadClass.onUploadProgress = this.onUploadProgress
  }

  showUploadModal() {
    window.console.log('showUploadModal')
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

  async handleChange(file: any) {
    const isUpLoadSize = file.raw.size / 1024 / 1024 < this.upLoadSize
    if (!isUpLoadSize) {
      this.$notify.error('file must smaller than ' + this.upLoadSize + 'MB!')
      return
    } else {
      await this.fileUploadClass.startUpload(file.raw)
    }
    return false
  }

  handleRemove(file: fileInfo) {
    var filesclone = [...this.fileList]
    var findfile = filesclone.filter((o) => o.uid == file.uid)[0]

    var findfileIndex = filesclone.indexOf(findfile)
    filesclone.splice(findfileIndex, 1)
    this.UpdateFileList_Inner(filesclone)
  }
  async beforeUpload(file: any, fileList: any[]) {}

  onUploadProgress(part: string, precent: number) {
    //window.console.log('上传了' + precent + '%')
  }
  onUploadError(error: any) {
    this.$message.error(error + `file upload failed.`)
  }

  onUploadSuccess(relativePath: string, fileName: string) {
    var fileinfo = new fileInfo()
    fileinfo.uid = getUuid()
    fileinfo.name = fileName
    fileinfo.url = relativePath
    //window.console.log('上传文件大小子')
    var res = []
    if (this.fileList) {
      res = deepClone(this.fileList)
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
.hideClass {
  display: none;
}
</style>
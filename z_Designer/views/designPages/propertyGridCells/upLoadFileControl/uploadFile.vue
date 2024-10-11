<template>
  <div>
    <el-button class="themeButton" type="primary" @click="showUploadModal" size="small" style="width: 82px; height: 24px; background: rgba(24, 183, 101, 1); border-radius: 2px; border: 1px solid rgba(12, 155, 81, 1); border-color: rgba(24, 183, 101, 1)">
      <img v-if="imageUrl" v-lazy="imageUrl" :width="15 + 'px'" :height="15 + 'px'" />
      <span>Upload File</span>
    </el-button>

    <el-dialog ref="previewPopup" title="Upload File" class="bhaviorDialog" style="height: 400px; width: 600px" v-model="windowVisible" :close-on-click-modal="false" :close-on-press-escape="false" fullscreen append-to-body destroy-on-close>
      <!-- :before-close="onClose" -->

      <div style="height: calc(100% - 70px)">
        <el-upload :action="uploadServerAddr" v-model:file-list="currentFileList" :headers="httpHeaders" :before-upload="beforeUpload" :on-success="handleUploadSuccess" :on-error="handleUploadError" :accept="fileTypes" :limit="maxFileLength" list-type="picture-card">
          <!-- ****上传文件的按钮************************************ -->
          <template v-if="currentFileList.length < maxFileLength" #default>
            <div style="height: 100%; width: 100%" class="flexHorilanLayout verticalAlignCenter">
              <el-icon class="avatar-uploader-icon">
                <Plus />
              </el-icon>
            </div>
          </template>
          <template v-else #default>
            <div style="height: 100%; width: 100%" class="flexHorilanLayout verticalAlignCenter">The maximum number of uploads has been reached</div>
          </template>
          <!-- ****已上传文件************************************ -->
          <template #file="{ file }">
            <div>
              <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
              <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-preview" @click="handlePreview(file)">
                  <el-icon class="avatar-uploader-icon">
                    <ZoomIn />
                  </el-icon>
                </span>
                <span class="el-upload-list__item-delete" @click="handleRemove(file)">
                  <el-icon class="avatar-uploader-icon">
                    <Delete />
                  </el-icon>
                </span>
              </span>
            </div>
          </template>
        </el-upload>
        <!-- ****预览窗口************************************ -->

        <el-dialog v-model="previewVisible">
          <img w-full :src="previewImage" alt="Preview Image" />
        </el-dialog>
      </div>
      <template #footer>
        <div class="dialog-footer" style="height: 50px">
          <el-button @click="handleWindowClose">Cancel</el-button>
          <el-button type="primary" @click="handleWindowOK">Sure</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
// import { CurrentApis, CurrentContext } from '../01designerContext'
// import { fileInfo } from '../01designerContext'
import { getUuid, deepClone, BuildingFileUrlForShow } from '@common/utils'
import { Delete, Plus, ZoomIn } from '@element-plus/icons-vue'

import { getConfigByName } from '@common/baseConfigs'
const apiAddr = () => getConfigByName('apiAddr')
export class fileInfo {
  uid: string = 'uid' // 文件唯一标识，建议设置为负数，防止和内部产生的 id 冲突
  name: string
  get url(): string {
    return BuildingFileUrlForShow(this.uid)
  }
}
@Options({
  components: {
    Plus,
    Delete,
    ZoomIn
  }
})
export default class uploadFile extends Vue {
  @Prop() private fileList: fileInfo[]
  @Prop() private maxFileLength: number
  @Prop() private fileType: string
  @Prop() private upLoadSize: number
  @Prop() private imageUrl: string

  private uploadServerAddr = apiAddr() + 'api/file/UploadFile'
  private get httpHeaders(): any {
    return { token: this.$store.state.system.token }
  }

  @Emit('update:fileList')
  UpdateFileList_Inner(flist: fileInfo[]) {}

  get currentFileList(): fileInfo[] {
    if (!this.fileList) {
      return []
    }
    var files: fileInfo[] = []
    this.fileList.filter((o) => {
      var info = new fileInfo()
      info.uid = o.uid
      info.name = o.name
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

  mounted() {}

  showUploadModal() {
    this.windowVisible = true
  }

  handleWindowClose() {
    //window.console.log('Sure')
    this.windowVisible = false
  }
  handleUploadSuccess(response: any, file: File) {
    let uploadfileId = response.data
    var newfileinfo: any = {
      uid: uploadfileId,
      name: file.name
    }

    var filesclone = []
    if (this.fileList) {
      filesclone = filesclone.concat(deepClone(this.fileList))
    }

    filesclone.push(newfileinfo)
    this.UpdateFileList_Inner(filesclone)
    window.console.log('handleUploadSuccess:', response)
  }

  handleUploadError(file: any) {
    window.console.log('handleUploadError:', file)
  }
  beforeUpload(file: any, fileList: any[]) {
    // window.console.log('beforeUpload:', file)
    const isUpLoadSize = file.size / 1024 / 1024 < this.upLoadSize
    if (!isUpLoadSize) {
      alert('file must smaller than ' + this.upLoadSize + 'MB!')
      return false
    }
    return true
  }
  // *****************************************************
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
  handleRemove(file: any) {
    window.console.log('handleRemove:', file)
    var filesclone = deepClone(this.fileList)
    var findfile = filesclone.filter((o) => o.uid == file.uid)[0]

    var findfileIndex = filesclone.indexOf(findfile)
    filesclone.splice(findfileIndex, 1)
    this.UpdateFileList_Inner(filesclone)
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

.el-dialog__header {
  display: none !important;
}

.el-dialog__body {
  padding: 0px !important;
}
</style>

<template>
  <div>
    <el-button class="themeButton" type="primary" @click="showUploadModal" size="small" style="width: 82px; height: 30px; background: rgba(24, 183, 101, 1); border-radius: 2px; border: 1px solid rgba(12, 155, 81, 1); border-color: rgba(24, 183, 101, 1)">
      <img v-if="imageUrl" v-lazy="imageUrl" :width="15 + 'px'" :height="15 + 'px'" />
      <span>上传文件</span>
    </el-button>
    <el-dialog :maskClosable="false" title="选择文件" v-model:visible="windowVisible" width="60%" :destroyOnClose="true">
      <div style="min-height: 7em">
        <el-upload :action="uploadServerAddr" :headers="headers" :file-list="currentFileList" :before-upload="beforeUpload" :on-success="handleUploadSuccess" :on-error="handleUploadError" :accept="fileTypes" :limit="maxFileLength" list-type="picture-card">
          <!-- ****上传文件的按钮************************************ -->
          <template v-if="currentFileList.length < maxFileLength" #default>
            <div style="height: 100%; width: 100%" class="flexHorilanLayout verticalAlignCenter">
              <i class="el-icon-plus"></i>
            </div>
          </template>
          <template v-else #default>
            <div style="height: 100%; width: 100%" class="flexHorilanLayout verticalAlignCenter">上传数量已经到达最大</div>
          </template>
          <!-- ****已上传文件************************************ -->
          <template #file="{ file }">
            <div>
              <img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
              <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-preview" @click="handlePreview(file)">
                  <i class="el-icon-zoom-in"></i>
                </span>
                <span class="el-upload-list__item-delete" @click="handleRemove(file)">
                  <i class="el-icon-delete"></i>
                </span>
              </span>
            </div>
          </template>
        </el-upload>
        <!-- ****预览窗口************************************ -->
        <el-dialog v-model:visible="previewVisible">
          <img alt="example" style="width: 100%" :src="previewImage" cancelText="取消" okText="确定" />
          <template #footer>
            <div class="dialog-footer">
              <el-button @click="handlePreviewClose">取 消</el-button>
              <el-button type="primary" @click="handlePreviewClose">确 定</el-button>
            </div>
          </template>
        </el-dialog>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="handleWindowClose">取 消</el-button>
          <el-button type="primary" @click="handleWindowOK">确 定</el-button>
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
import { getConfigByName } from '@common/baseConfigs'
const apiAddr = () => getConfigByName('apiAddr')
export class fileInfo {
  uid: string = 'uid' // 文件唯一标识，建议设置为负数，防止和内部产生的 id 冲突
  name: string
  get url(): string {
    return BuildingFileUrlForShow(this.uid)
  }
}
@Options({})
export default class uploadFile extends Vue {
  @Prop() private fileList: fileInfo[]
  @Prop() private maxFileLength: number
  @Prop() private fileType: string
  @Prop() private upLoadSize: number
  @Prop() private imageUrl: string

  private uploadServerAddr = apiAddr() + 'api/file/UploadFile'
  private headers: any = {
    token: this.$store.state.system.token
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
    //window.console.log('确定')
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
      filesclone = filesclone.concat([...this.fileList])
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
    var filesclone = [...this.fileList]
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
</style>

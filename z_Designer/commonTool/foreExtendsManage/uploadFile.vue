<template>
  <div style="width:100%;height:100%">
    <el-upload :file-list="fileList" :on-change="onFileChanged" :on-success="handleUploadSuccess" :on-error="handleUploadError" :accept="fileTypes"
      :limit="maxFileLength" list-type="text" :auto-upload="false" multiple>

      <template #trigger>
        <el-button type="primary">选择文件</el-button>
      </template>

      <template v-if="fileList.length >= maxFileLength" #tip>
        <div class="el-upload__tip">
          已经达到最大文件数量
        </div>
      </template>

    </el-upload>
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

@Options({
  components: {
    Plus,
    Delete,
    ZoomIn
  }
})
export default class uploadFile extends Vue {
  @Prop() private fileList: any[]
  @Prop() private maxFileLength: number
  @Prop() private fileType: string

  @Emit('update:fileList')
  UpdateFileList_Inner(flist: any[]) {}

  get fileTypes(): string {
    if (this.fileType == 'vectorgraph') {
      return '.png,.jpg,.gif'
    } else if (this.fileType == 'image') {
      return 'image/*'
    } else if (this.fileType == 'file') {
      return '.css,.js'
    } else if (this.fileType == 'vedio') {
      return 'video/*'
    } else {
      return '*.*'
    }
  }

  mounted() {}

  handleUploadSuccess(response: any, file: File) {
    debugger
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
  }

  handleUploadError(file: any) {
    window.console.log('handleUploadError:', file)
  }
  onFileChanged(file: any, fileList: any[]) {
    let res = []
    for (let index = 0; index < fileList.length; index++) {
      const file = fileList[index]
      let find = res.find((o) => o.size === file.size && o.name === file.name)
      if (!find) {
        res.push(file)
      }
    }
    this.UpdateFileList_Inner(res)
  }
  // *****************************************************
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

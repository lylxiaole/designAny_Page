<template>
  <div>
    <el-dialog v-model="dialogFormVisible" title="Shipping address" style="width:600px;height:400px" append-to-body :destroyOnClose="true"
      :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :model="formData">
        <el-form-item :label="$t('tip.name')" :label-width="80">
          <el-input v-model="formData.name" autocomplete="off" style="width: 200px" />
        </el-form-item>
        <el-form-item :label="$t('tip.uploadFile')" :label-width="80">
          <uploadFile ref="uploadFileRef" v-model:fileList="formData.fileList" :maxFileLength="500" :upLoadSize="500" fileType="file"
            style="width: 500px" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="verticalAlignCenter flexHorilanLayout" style="width:100%;height:60px">
          <el-button @click="dialogFormVisible = false">{{$t('opts.cancel')}}</el-button>
          <el-button type="primary" @click="onSureUpload">
            {{$t('opts.sure')}}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { ExtandFile, addExtandFile, getAllExtandFiles, deleteExtandFile } from '@common/apis/designForeExtands'
import uploadFile from './uploadFile.vue'
import { ElMessage, ElMessageBox } from 'element-plus'

@Options({ components: { uploadFile } })
export default class foreExtandsManage extends Vue {
  mounted() {}
  public show() {
    this.dialogFormVisible = true
    this.formData = { fileList: [], name: '' }
  }
  // *********************************************************
  private dialogFormVisible: boolean = false
  private formData: any = { fileList: [], name: '' }
  // *********************************************************
  private async onSureUpload() {
    if (!this.formData.name) {
      ElMessage.error('请填写插件名称')
      return
    }
    if (!this.formData.fileList || this.formData.fileList.length < 1) {
      ElMessage.error('请选择文件')
      return
    }

    let data = { name: this.formData.name, type: this.formData.type }
    try {
      await addExtandFile(data as any, this.formData.fileList)
      ElMessage.success('插件导入成功,刷新页面后可以使用！')
      this.dialogFormVisible = false
      this.onLeadInSuccess()
    } catch (error: any) {
      ElMessage.error(error.message)
    }
  }

  @Emit('onLeadInSuccess')
  private onLeadInSuccess() {}
}
</script>

<style lang="less" scoped>
</style>

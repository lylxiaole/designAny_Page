<template>
  <div>
    <el-dialog v-model="dialogFormVisible" title="Shipping address" append-to-body :destroyOnClose="true">
      <el-form :model="formData">
        <el-form-item :label="$t('tip.name')" :label-width="80">
          <el-input v-model="formData.name" autocomplete="off" />
        </el-form-item>
        <el-form-item :label="$t('tip.type')" :label-width="80">
          <el-select v-model="formData.type" size="small" style="width: 100%">
            <el-option :label="$t('tip.customPage')" value="customPage" />
            <el-option :label="$t('tip.extendComp')" value="extendComp" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('tip.uploadFile')" :label-width="80">
          <uploadFile ref="uploadFileRef" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogFormVisible = false">{{$t('tip.cancel')}}</el-button>
          <el-button type="primary" @click="onSureUpload">
            {{$t('tip.sure')}}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import { ExtandFile, addExtandFile, getAllExtandFiles, deleteExtandFile } from '@common/apis/designForeExtands'
import uploadFile from './uploadFile.vue'

@Options({ components: { uploadFile } })
export default class foreExtandsManage extends Vue {
  mounted() {}
  public show() {
    this.dialogFormVisible = true
  }
  // *********************************************************
  private dialogFormVisible: boolean = false
  private formData: any = {}
  private onLeadInExtend() {
    this.dialogFormVisible = true
  }

  private onSureUpload() {
    let data = { name: this.formData.name, type: this.formData.type }
  }
}
</script>

<style lang="less" scoped>
</style>

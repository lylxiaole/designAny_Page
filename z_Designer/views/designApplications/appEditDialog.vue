<template>
  <el-dialog title="Tip" v-model="dialogVisible" width="350px" center>
    <el-form ref="currentFrom" :inline="false" style="height: 200px" :model="applicationForm" class="demo-ruleForm">
      <el-form-item label="Application Name" style="width: 300px">
        <el-input v-model="applicationForm.name" placeholder="Please Input"></el-input>
      </el-form-item>
      <el-form-item label="Application Type" style="width: 300px">
        <el-select v-model="applicationForm.type" :disabled="isEdit" placeholder="Please Input">
          <!-- <el-option label="看板" :value="0"></el-option>
            <el-option label="报表" :value="1"></el-option> -->
          <el-option label="PC App" :value="2"></el-option>
          <el-option label="H5 App" :value="3"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onCancelHandle">Cancel</el-button>
        <el-button type="primary" @click="onSureHandle">Sure</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import PageBase from '@common/views/PageBase'
import { AddOrUpdate } from '@common/apis/designDictionary'
import { Emit, Ref } from 'vue-property-decorator'
import { GetApplicationList, AddApplication, DeleteApplication, UpdateApplication, ApplicationDC } from '@common/apis/designApplication'

@Options({ components: {} })
export default class appEditDialog extends PageBase {
  private dialogVisible: boolean = false
  private isEdit: boolean = false

  @Ref('applicationForm')
  private applicationForm: any = {
    name: '',
    type: 2
  }
  public async addAppHandle() {
    this.isEdit = false
    this.dialogVisible = true
  }
  public async editAppHandle(data: ApplicationDC) {
    this.applicationForm.name = data.name
    this.applicationForm.type = data.type
    this.applicationForm.id = data.id
    this.isEdit = true
    this.dialogVisible = true
  }
  private async onSureHandle() {
    let valid = await (this.$refs.currentFrom as any).validate()
    if (!valid) {
      return false
    }
    try {
      let requdata: any = { name: this.applicationForm.name.trim(), type: this.applicationForm.type, id: this.applicationForm.id }
      if (this.isEdit) {
        await UpdateApplication(requdata)
      } else {
        await AddApplication(requdata)
      }
      this.onSure()
    } catch (error) {
    } finally {
      this.dialogVisible = false
    }
  }
  private async onCancelHandle() {
    this.dialogVisible = false
  }
  // ************************************
  @Emit('onSure')
  private async onSure() {}
}
</script>

<style lang="less">
.el-dialog__header {
  display: none !important;
}

.el-dialog__body {
  padding: 0px !important;
}
</style>

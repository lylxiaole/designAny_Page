<template>
  <el-dialog title="数据库" v-model="dialogVisible" width="30%" center>
    <el-form ref="currentFrom" :inline="true" :model="dbForm" class="demo-form-inline">
      <el-form-item label="数据库名称">
        <el-input v-model="dbForm.databaseName" placeholder="数据库名称"></el-input>
      </el-form-item>
      <el-form-item label="数据库编码">
        <el-input v-model="dbForm.databaseCode" placeholder="数据库编码"></el-input>
      </el-form-item>
      <el-form-item label="数据库类型">
        <el-select v-model="dbForm.databaseType" placeholder="请选择数据库类型" style="width:150px">
          <el-option label="内置数据库" :value="0"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <!-- ********************************************************** -->
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="onCancelHandle">取 消</el-button>
        <el-button type="primary" @click="onSureHandle">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component'
import { Prop, Component, Emit, Ref } from 'vue-property-decorator'

import ComponentBase from '@common/views/ComponentBase'
import { GetDataBases, AddDataBase, DeleteDatabase } from '@common/apis/designDB'
import { toRaw } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

@Options({})
export default class dbList extends ComponentBase {
  private dialogVisible: boolean = false

  @Ref('dbForm')
  private dbForm: any = {
    databaseName: '',
    databaseCode: '',
    databaseType: 0
  }
  private async show(data?: any) {
    this.dialogVisible = true
    if (data) {
      this.dbForm = data
    } else {
      this.dbForm = {
        databaseName: '',
        databaseCode: '',
        databaseType: 0
      }
    }
  }
  private async onSureHandle() {
    let valid = await (this.$refs.currentFrom as any).validate()
    if (!valid) {
      return false
    }
    try {
      await AddDataBase(toRaw(this.dbForm))
      this.onSure()
      this.dialogVisible = false
    } catch (error: any) {
      ElMessage.error('操作失败:' + error.message)
    } finally {
    }
  }

  private async onCancelHandle() {
    this.dialogVisible = false
  }

  @Emit('onSure')
  private onSure() {}
}
</script>

<style scoped>
.applicationItem {
  box-sizing: border-box;
  padding: 4px 8px;
  width: 100%;
  height: 36px;
  line-height: 36px;
  cursor: pointer;
}

.applicationItem:hover {
  background-color: #83c346;
  color: white;
}
</style>

<template>
  <el-dialog title="编辑列" v-model="dialogVisible" width="30%" center>
    <el-form ref="currentFrom" :inline="true" :model="columnForm">
      <el-form-item label="列名">
        <el-input v-model="columnForm.columnName" placeholder="列名"></el-input>
      </el-form-item>
      <el-form-item label="列编码">
        <el-input v-model="columnForm.columnCode" placeholder="列编码"></el-input>
      </el-form-item>
      <el-form-item label="是否必填">
        <el-switch v-model="columnForm.isRequired" />
      </el-form-item>
      <el-form-item label="数据类型">
        <el-select v-model="columnForm.columnDataType" placeholder="请选择数据类型">
          <el-option label="String" :value="1"></el-option>
          <el-option label="Boolean" :value="2"></el-option>
          <el-option label="Number" :value="3"></el-option>
          <el-option label="Json" :value="4"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
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
import { Component, Emit, Watch, Prop } from 'vue-property-decorator'
import PageBase from '@common/views/PageBase'
import { UpDateColumn, AddColumn } from '@common/apis/designDB'

@Options({})
export default class columnEditDialog extends PageBase {
  private dialogVisible: boolean = false
  private isAdd: boolean = true
  private columnForm: any = {
    databaseId: '',
    tableId: '',
    columnName: '',
    columnCode: '',
    isRequired: true,
    columnDataType: 1
  }
  mounted() {}
  public addColumnDialog(dataBaseId, tableId) {
    this.columnForm.databaseId = dataBaseId
    this.columnForm.tableId = tableId
    this.isAdd = true
    this.dialogVisible = true
  }
  public editColumnDialog(column) {
    this.columnForm = column
    this.isAdd = false
    this.dialogVisible = true
  }
  private onCancelHandle() {
    this.dialogVisible = false
  }
  private async onSureHandle() {
    let valid = await (this.$refs.currentFrom as any).validate()
    if (!valid) {
      return false
    }
    try {
      let issuccess = false
      if (this.isAdd) {
        issuccess = await AddColumn(this.columnForm)
      } else {
        issuccess = await UpDateColumn(this.columnForm)
      }
      this.onSureEdit()
    } catch (error: any) {
      alert(error.message)
    } finally {
      this.dialogVisible = false
    }
  }

  @Emit('onSureEdit')
  private onSureEdit() {}
}
</script>

<style>
</style>
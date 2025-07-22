<template>
  <el-dialog title="提示" v-model="dialogVisible" width="30%" center>
    <el-form ref="currentFrom" :inline="true" :model="tableForm" class="demo-form-inline">
      <el-form-item label="表名">
        <el-input v-model="tableForm.name" placeholder="表名"></el-input>
      </el-form-item>
      <el-form-item label="表编码">
        <el-input :disabled="currentTable!==null" v-model="tableForm.code" placeholder="表编码"></el-input>
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
import { Prop, Component, Emit, Ref } from 'vue-property-decorator'
import ComponentBase from '@common/views/ComponentBase'
import { GetTables, AddTable, DeleteTable, DataBaseDC, TableDC, UpdateTable } from '@common/apis/designDB'
import { ElMessageBox } from 'element-plus'

@Options({})
export default class tableList extends ComponentBase {
  private dialogVisible: boolean = false

  private currentDB: DataBaseDC = null
  private currentTable: TableDC = null

  @Ref('tableForm')
  private tableForm: any = {
    name: '',
    code: ''
  }

  public async show(db: DataBaseDC, table?: TableDC) {
    this.currentDB = db

    if (table) {
      this.currentTable = table
      this.tableForm.name = table.tableName
      this.tableForm.code = table.tableCode
    } else {
      this.currentTable = null
      this.tableForm.name = ''
      this.tableForm.code = ''
    }
    this.dialogVisible = true
  }

  private async onSureHandle() {
    let valid = await (this.$refs.currentFrom as any).validate()
    if (!valid) {
      return false
    }
    try {
      let name = this.tableForm.name.trim()
      let code = this.tableForm.code.trim()
      if (this.currentTable) {
        this.currentTable.tableName = name
        await UpdateTable(this.currentTable)
      } else {
        await AddTable(this.currentDB.id, name, code)
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
  // ***********************************************************************
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
